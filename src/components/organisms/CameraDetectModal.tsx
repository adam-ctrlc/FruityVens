import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Modal, View, TouchableOpacity, ScrollView, useWindowDimensions,
  Animated, Text,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Button, FruitAvatar } from '@/components/atoms';
import {
  detectFruitsFromUri, isDetectionAvailable, LABEL_TO_FRUIT_ID,
} from '@/services/FruitDetectionService';
import { FruitDetection } from '@/types/detection';
import { Fruit } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraDetectModalProps {
  visible: boolean;
  fruits: Fruit[];
  onFruitDetected: (fruit: Fruit) => void;
  onClose: () => void;
}

const GREEN = '#22c55e';
const CORNER = 32;
const THICK = 3;
const STABLE_NEEDED = 4;

// ─── Bounding box overlay ────────────────────────────────────────────────────
// Maps YOLO image coordinates → screen coordinates and draws dynamic brackets.
function DetectionBox({
  detection, imgW, imgH, screenW, screenH,
}: {
  detection: FruitDetection;
  imgW: number;
  imgH: number;
  screenW: number;
  screenH: number;
}) {
  // Camera preview uses 'cover': fill screen, crop excess
  const scale = Math.max(screenW / imgW, screenH / imgH);
  const offsetX = (imgW * scale - screenW) / 2;
  const offsetY = (imgH * scale - screenH) / 2;

  const [ix1, iy1, ix2, iy2] = detection.boundingBox as number[];
  const left   = Math.max(0, ix1 * scale - offsetX);
  const top    = Math.max(0, iy1 * scale - offsetY);
  const right  = Math.min(screenW, ix2 * scale - offsetX);
  const bottom = Math.min(screenH, iy2 * scale - offsetY);
  const boxW   = right - left;
  const boxH   = bottom - top;
  const arm    = Math.round(Math.min(CORNER, boxW * 0.22, boxH * 0.22));
  const pct    = Math.round(detection.confidence * 100);

  if (boxW < 20 || boxH < 20) return null;

  return (
    <View style={{ position: 'absolute', left, top, width: boxW, height: boxH }}>
      {/* Label tag — above the box */}
      <View style={{
        position: 'absolute',
        top: -34,
        left: 0,
        backgroundColor: GREEN,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
      }}>
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', textTransform: 'capitalize' }}>
          {detection.label}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' }}>
          {pct}%
        </Text>
      </View>

      {/* Corner brackets — TL */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: arm, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: 0, left: 0, width: THICK, height: arm, backgroundColor: GREEN, borderRadius: 2 }} />
      {/* TR */}
      <View style={{ position: 'absolute', top: 0, right: 0, width: arm, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: 0, right: 0, width: THICK, height: arm, backgroundColor: GREEN, borderRadius: 2 }} />
      {/* BL */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: arm, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: THICK, height: arm, backgroundColor: GREEN, borderRadius: 2 }} />
      {/* BR */}
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: arm, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: THICK, height: arm, backgroundColor: GREEN, borderRadius: 2 }} />
    </View>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────
export default function CameraDetectModal({
  visible, fruits, onFruitDetected, onClose,
}: CameraDetectModalProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [mode, setMode] = useState<'ai' | 'manual'>('manual');
  // detection + image dims needed for coordinate mapping
  const [detected, setDetected] = useState<{
    detection: FruitDetection; imgW: number; imgH: number;
  } | null>(null);
  const [confirmProgress, setConfirmProgress] = useState(0);

  // Sweep animation — used in manual mode as a scan hint
  const sweepAnim = useRef(new Animated.Value(0)).current;

  // Fixed scan frame geometry (manual mode guide)
  const FRAME = Math.min(width * 0.72, 280);
  const frameLeft = (width - FRAME) / 2;
  const frameTop = insets.top + 52;
  const frameBottom = frameTop + FRAME;
  const sweepY = sweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [frameTop, frameBottom - THICK],
  });

  useEffect(() => {
    if (!visible || mode !== 'manual') { sweepAnim.stopAnimation(); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweepAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(sweepAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, mode]);

  const loopActive = useRef(false);
  const fruitsRef = useRef(fruits);
  fruitsRef.current = fruits;
  const onDetectedRef = useRef(onFruitDetected);
  onDetectedRef.current = onFruitDetected;

  useEffect(() => {
    if (visible) {
      setMode(isDetectionAvailable() ? 'ai' : 'manual');
      setDetected(null);
      setConfirmProgress(0);
    } else {
      loopActive.current = false;
    }
  }, [visible]);

  // AI detection loop — only when ONNX is really available (dev build)
  useEffect(() => {
    if (!visible || !permission?.granted || mode !== 'ai') return;
    loopActive.current = true;
    let stableLabel = '';
    let stableCount = 0;

    const runLoop = async () => {
      while (loopActive.current) {
        const cam = cameraRef.current;
        if (cam) {
          try {
            const photo = await cam.takePictureAsync({ quality: 0.35 });
            if (!loopActive.current) break;
            const result = await detectFruitsFromUri(photo.uri);
            if (!loopActive.current) break;

            const top = result.detections
              .filter(d => LABEL_TO_FRUIT_ID[d.label])
              .sort((a, b) => b.confidence - a.confidence)[0];

            if (top && top.confidence > 0.72) {
              if (top.label === stableLabel) {
                stableCount = Math.min(stableCount + 1, STABLE_NEEDED);
              } else {
                stableLabel = top.label;
                stableCount = 1;
              }
              setDetected({ detection: top, imgW: result.imageWidth, imgH: result.imageHeight });
              setConfirmProgress(stableCount / STABLE_NEEDED);

              if (stableCount >= STABLE_NEEDED) {
                loopActive.current = false;
                const fruit = fruitsRef.current.find(f => f.id === LABEL_TO_FRUIT_ID[stableLabel]);
                if (fruit) onDetectedRef.current(fruit);
                return;
              }
            } else {
              stableLabel = '';
              stableCount = 0;
              setDetected(null);
              setConfirmProgress(0);
            }
          } catch {
            if (!loopActive.current) break;
            setMode('manual');
            break;
          }
        }
        await new Promise<void>(r => setTimeout(r, 150));
      }
    };

    runLoop();
    return () => { loopActive.current = false; };
  }, [visible, permission?.granted, mode]);

  const handleClose = useCallback(() => {
    loopActive.current = false;
    onClose();
  }, [onClose]);

  const handleSelect = useCallback((fruit: Fruit) => {
    loopActive.current = false;
    onFruitDetected(fruit);
  }, [onFruitDetected]);

  // ─── Permission screen ──────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
        <View className="flex-1 bg-black items-center justify-center px-8" style={{ gap: 20, paddingTop: insets.top }}>
          <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center">
            <Ionicons name="camera-outline" size={40} color="#9ca3af" />
          </View>
          <ThemedText size="lg" weight="semibold" variant="inverse" className="text-center">
            Camera Permission Required
          </ThemedText>
          <ThemedText variant="inverse" className="text-center opacity-60">
            FruityVens needs camera access to scan fruits.
          </ThemedText>
          <Button label="Allow Camera" onPress={requestPermission} size="lg" />
          <TouchableOpacity onPress={handleClose}>
            <ThemedText variant="inverse" className="opacity-50">Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  // ─── AI mode: full-screen camera + dynamic bounding box ─────────────────
  if (mode === 'ai') {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
        <View className="flex-1 bg-black">
          {/* Full-screen camera */}
          <CameraView
            ref={cameraRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            facing="back"
          />

          {/* Dynamic bounding box — moves with detected fruit */}
          {detected && (
            <DetectionBox
              detection={detected.detection}
              imgW={detected.imgW}
              imgH={detected.imgH}
              screenW={width}
              screenH={height}
            />
          )}

          {/* No detection: subtle scanning hint corners */}
          {!detected && (
            <>
              {/* TL */}
              <View style={{ position: 'absolute', top: frameTop, left: frameLeft, width: CORNER, height: THICK, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              <View style={{ position: 'absolute', top: frameTop, left: frameLeft, width: THICK, height: CORNER, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              {/* TR */}
              <View style={{ position: 'absolute', top: frameTop, left: frameLeft + FRAME - CORNER, width: CORNER, height: THICK, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              <View style={{ position: 'absolute', top: frameTop, left: frameLeft + FRAME - THICK, width: THICK, height: CORNER, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              {/* BL */}
              <View style={{ position: 'absolute', top: frameBottom - THICK, left: frameLeft, width: CORNER, height: THICK, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              <View style={{ position: 'absolute', top: frameBottom - CORNER, left: frameLeft, width: THICK, height: CORNER, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              {/* BR */}
              <View style={{ position: 'absolute', top: frameBottom - THICK, left: frameLeft + FRAME - CORNER, width: CORNER, height: THICK, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              <View style={{ position: 'absolute', top: frameBottom - CORNER, left: frameLeft + FRAME - THICK, width: THICK, height: CORNER, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
            </>
          )}

          {/* Close */}
          <TouchableOpacity
            onPress={handleClose}
            style={{
              position: 'absolute', top: insets.top + 10, left: 16,
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.45)',
              alignItems: 'center', justifyContent: 'center',
            }}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>

          {/* Bottom panel */}
          <View style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(15,23,42,0.88)',
            paddingTop: 18, paddingHorizontal: 20,
            paddingBottom: insets.bottom + 22,
          }}>
            {detected ? (
              <View className="flex-row items-center" style={{ gap: 16 }}>
                <FruitAvatar fruitId={LABEL_TO_FRUIT_ID[detected.detection.label]} size={52} />
                <View className="flex-1">
                  <ThemedText size="xl" weight="bold" variant="inverse" style={{ textTransform: 'capitalize' }}>
                    {detected.detection.label}
                  </ThemedText>
                  <ThemedText size="sm" style={{ color: '#94a3b8', marginBottom: 10 }}>
                    {Math.round(detected.detection.confidence * 100)}% confidence
                  </ThemedText>
                  <View style={{ height: 4, borderRadius: 2, backgroundColor: '#1e293b' }}>
                    <View style={{
                      height: 4, borderRadius: 2, backgroundColor: GREEN,
                      width: `${Math.round(confirmProgress * 100)}%`,
                    }} />
                  </View>
                  <ThemedText size="xs" style={{ color: '#64748b', marginTop: 5 }}>
                    Hold steady — confirming…
                  </ThemedText>
                </View>
              </View>
            ) : (
              <View className="items-center py-1" style={{ gap: 4 }}>
                <ThemedText size="sm" style={{ color: '#94a3b8' }}>Point camera at a fruit…</ThemedText>
                <ThemedText size="xs" style={{ color: '#475569' }}>
                  Apple · Banana · Mango · Orange · Grape
                </ThemedText>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { loopActive.current = false; setMode('manual'); }}
              className="flex-row items-center justify-center mt-4"
              style={{ gap: 6 }}
            >
              <Ionicons name="list-outline" size={15} color="#475569" />
              <ThemedText size="sm" style={{ color: '#475569' }}>Select manually</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // ─── Manual mode: fixed scan square + animated sweep + fruit list ────────
  const panelTop = frameBottom + 16;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <View className="flex-1 bg-black">
        {/* Camera (no captures taken in manual mode) */}
        <CameraView
          ref={cameraRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          facing="back"
        />

        {/* Vignette */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: frameTop, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <View style={{ position: 'absolute', top: frameBottom, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <View style={{ position: 'absolute', top: frameTop, left: 0, width: frameLeft, height: FRAME, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <View style={{ position: 'absolute', top: frameTop, left: frameLeft + FRAME, right: 0, height: FRAME, backgroundColor: 'rgba(0,0,0,0.6)' }} />

        {/* Green corner brackets */}
        {/* TL */}
        <View style={{ position: 'absolute', top: frameTop, left: frameLeft, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
        <View style={{ position: 'absolute', top: frameTop, left: frameLeft, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />
        {/* TR */}
        <View style={{ position: 'absolute', top: frameTop, left: frameLeft + FRAME - CORNER, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
        <View style={{ position: 'absolute', top: frameTop, left: frameLeft + FRAME - THICK, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />
        {/* BL */}
        <View style={{ position: 'absolute', top: frameBottom - THICK, left: frameLeft, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
        <View style={{ position: 'absolute', top: frameBottom - CORNER, left: frameLeft, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />
        {/* BR */}
        <View style={{ position: 'absolute', top: frameBottom - THICK, left: frameLeft + FRAME - CORNER, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
        <View style={{ position: 'absolute', top: frameBottom - CORNER, left: frameLeft + FRAME - THICK, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />

        {/* Animated sweep line inside frame */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: frameLeft + THICK,
            width: FRAME - THICK * 2,
            transform: [{ translateY: sweepY }],
          }}
        >
          <View style={{ height: 5, backgroundColor: 'rgba(34,197,94,0.15)' }} />
          <View style={{ height: 2, backgroundColor: GREEN, opacity: 0.9 }} />
          <View style={{ height: 5, backgroundColor: 'rgba(34,197,94,0.15)' }} />
        </Animated.View>

        {/* Close */}
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: 'absolute', top: insets.top + 10, left: 16,
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.45)',
            alignItems: 'center', justifyContent: 'center',
          }}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="close" size={22} color="white" />
        </TouchableOpacity>

        {/* Fruit picker — below scan frame, overlaid on dark camera bg */}
        <View style={{ position: 'absolute', top: panelTop, left: 0, right: 0, bottom: 0 }}>
          <View style={{
            paddingHorizontal: 20, paddingBottom: 8,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <ThemedText size="sm" weight="semibold" variant="inverse" style={{ opacity: 0.9 }}>
              Select fruit
            </ThemedText>
            <View style={{
              backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 8,
              paddingHorizontal: 8, paddingVertical: 3,
              flexDirection: 'row', alignItems: 'center', gap: 4,
            }}>
              <Ionicons name="construct-outline" size={11} color="#f59e0b" />
              <ThemedText size="xs" style={{ color: '#f59e0b' }}>Dev build for AI</ThemedText>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            style={{ backgroundColor: 'rgba(15,23,42,0.84)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}
          >
            {fruits.map((fruit, i) => (
              <TouchableOpacity
                key={fruit.id}
                onPress={() => handleSelect(fruit)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 20, paddingVertical: 11,
                  borderBottomWidth: i < fruits.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255,255,255,0.05)',
                  gap: 14,
                }}
              >
                <FruitAvatar fruitId={fruit.id} size={40} />
                <View style={{ flex: 1 }}>
                  <ThemedText size="sm" weight="semibold" variant="inverse">{fruit.name}</ThemedText>
                  <ThemedText size="xs" style={{ color: '#64748b' }}>{fruit.stock} {fruit.unit} in stock</ThemedText>
                </View>
                <ThemedText size="sm" weight="bold" style={{ color: GREEN }}>
                  ₱{fruit.price.toFixed(2)}/{fruit.unit}
                </ThemedText>
                <Ionicons name="chevron-forward" size={16} color="#334155" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
