import React, { useRef, useState, useCallback } from 'react';
import { Modal, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Button, FruitAvatar } from '@/components/atoms';
import { detectFruitsFromUri, LABEL_TO_FRUIT_ID } from '@/services/FruitDetectionService';
import { FruitDetection, FruitDetectionResult } from '@/types/detection';
import { Fruit } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraDetectModalProps {
  visible: boolean;
  fruits: Fruit[];
  onFruitDetected: (fruit: Fruit) => void;
  onClose: () => void;
}

type Phase = 'camera' | 'processing' | 'results';

function DetectionRow({ detection, fruit, onSelect }: {
  detection: FruitDetection;
  fruit?: Fruit;
  onSelect: () => void;
}) {
  const pct = Math.round(detection.confidence * 100);
  return (
    <TouchableOpacity
      onPress={onSelect}
      className="flex-row items-center py-3 border-b border-green-50"
      activeOpacity={0.7}
    >
      <View style={{ width: 44 }}>
        {fruit ? (
          <FruitAvatar fruitId={fruit.id} size={36} />
        ) : (
          <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
            <Ionicons name="help-outline" size={18} color="#9ca3af" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <ThemedText size="sm" weight="semibold" style={{ textTransform: 'capitalize' }}>
          {detection.label}
        </ThemedText>
        <View className="flex-row items-center mt-1" style={{ gap: 6 }}>
          <View className="flex-1 h-1.5 bg-green-100 rounded-full">
            <View
              className="h-1.5 bg-green-500 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </View>
          <ThemedText size="xs" variant="muted">{pct}%</ThemedText>
        </View>
      </View>
      {fruit && (
        <ThemedText size="sm" weight="semibold" variant="primary">
          ${fruit.price.toFixed(2)}/{fruit.unit}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

export default function CameraDetectModal({
  visible, fruits, onFruitDetected, onClose,
}: CameraDetectModalProps) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('camera');
  const [result, setResult] = useState<FruitDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;
    setPhase('processing');
    setError(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });
      if (!photo) throw new Error('Camera returned no photo');
      const detectionResult = await detectFruitsFromUri(photo.uri);
      setResult(detectionResult);
      setPhase('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
      setPhase('camera');
    }
  }, []);

  const handleSelect = useCallback((detection: FruitDetection) => {
    const fruitId = LABEL_TO_FRUIT_ID[detection.label];
    const fruit = fruits.find(f => f.id === fruitId);
    if (fruit) {
      onFruitDetected(fruit);
    }
  }, [fruits, onFruitDetected]);

  const handleRetry = useCallback(() => {
    setResult(null);
    setError(null);
    setPhase('camera');
  }, []);

  const handleClose = useCallback(() => {
    setResult(null);
    setError(null);
    setPhase('camera');
    onClose();
  }, [onClose]);

  const matchedDetections = result?.detections.filter(d => LABEL_TO_FRUIT_ID[d.label]) ?? [];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-black/80">
          <ThemedText size="lg" weight="bold" variant="inverse">
            {phase === 'results' ? 'Detected Fruits' : 'Scan Fruit'}
          </ThemedText>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Camera / Processing / Results */}
        {phase === 'camera' || phase === 'processing' ? (
          <>
            {!permission?.granted ? (
              <View className="flex-1 items-center justify-center px-8" style={{ gap: 16 }}>
                <Ionicons name="camera-outline" size={64} color="#9ca3af" />
                <ThemedText variant="inverse" className="text-center">
                  Camera access is required to scan fruits.
                </ThemedText>
                <Button label="Grant Permission" onPress={requestPermission} />
              </View>
            ) : (
              <View className="flex-1">
                <CameraView
                  ref={cameraRef}
                  style={{ flex: 1 }}
                  facing="back"
                />
                {phase === 'processing' && (
                  <View className="absolute inset-0 bg-black/60 items-center justify-center" style={{ gap: 16 }}>
                    <ActivityIndicator size="large" color="#16a34a" />
                    <ThemedText variant="inverse" size="sm">Analysing image…</ThemedText>
                  </View>
                )}
              </View>
            )}

            {error && (
              <View className="px-5 py-3 bg-red-900/80">
                <ThemedText size="xs" variant="inverse">{error}</ThemedText>
              </View>
            )}

            {/* Capture button */}
            {permission?.granted && phase === 'camera' && (
              <View
                className="items-center py-8 bg-black"
                style={{ paddingBottom: insets.bottom + 16 }}
              >
                <TouchableOpacity
                  onPress={handleCapture}
                  className="w-20 h-20 rounded-full bg-white border-4 border-green-500 items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Ionicons name="scan-outline" size={32} color="#16a34a" />
                </TouchableOpacity>
                <ThemedText size="xs" variant="inverse" className="mt-3 opacity-60">
                  Point at a fruit and tap to scan
                </ThemedText>
              </View>
            )}
          </>
        ) : (
          /* Results panel */
          <View className="flex-1 bg-white rounded-t-3xl">
            <View className="px-5 pt-5 pb-3 border-b border-green-100">
              <ThemedText size="sm" variant="muted">
                {result?.summary} · {result?.inferenceTimeMs}ms
              </ThemedText>
            </View>

            {matchedDetections.length === 0 ? (
              <View className="flex-1 items-center justify-center" style={{ gap: 12 }}>
                <Ionicons name="search-outline" size={48} color="#9ca3af" />
                <ThemedText variant="muted">No matching fruits found.</ThemedText>
                <ThemedText size="xs" variant="muted">
                  Detects: apple, banana, grape, mango, orange
                </ThemedText>
              </View>
            ) : (
              <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <ThemedText size="xs" variant="muted" className="mt-3 mb-1">
                  Tap a result to open Add Sale for that fruit
                </ThemedText>
                {matchedDetections.map((d, i) => (
                  <DetectionRow
                    key={`${d.label}-${i}`}
                    detection={d}
                    fruit={fruits.find(f => f.id === LABEL_TO_FRUIT_ID[d.label])}
                    onSelect={() => handleSelect(d)}
                  />
                ))}
              </ScrollView>
            )}

            <View
              className="px-5 pt-3 border-t border-green-100"
              style={{ paddingBottom: insets.bottom + 12 }}
            >
              <Button label="Scan Again" variant="outline" onPress={handleRetry} fullWidth />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
