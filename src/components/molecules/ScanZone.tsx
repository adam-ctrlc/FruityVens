import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/atoms';

interface ScanZoneProps {
  onPress: () => void;
}

const GREEN = '#22c55e';
const CORNER = 24;
const THICK = 3;

export default function ScanZone({ onPress }: ScanZoneProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
    ).start();
    return () => pulse.stopAnimation();
  }, []);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1.55] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0.9, 0.35, 0] });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Open camera to scan a fruit"
      style={{
        borderRadius: 24,
        backgroundColor: '#0f172a',
        overflow: 'hidden',
        height: 252,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Corner bracket — TL */}
      <View style={{ position: 'absolute', top: 20, left: 20, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: 20, left: 20, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />
      {/* Corner bracket — TR */}
      <View style={{ position: 'absolute', top: 20, right: 20, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: 20, right: 20, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />
      {/* Corner bracket — BL */}
      <View style={{ position: 'absolute', bottom: 56, left: 20, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', bottom: 56, left: 20, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />
      {/* Corner bracket — BR */}
      <View style={{ position: 'absolute', bottom: 56, right: 20, width: CORNER, height: THICK, backgroundColor: GREEN, borderRadius: 2 }} />
      <View style={{ position: 'absolute', bottom: 56, right: 20, width: THICK, height: CORNER, backgroundColor: GREEN, borderRadius: 2 }} />

      {/* Pulsing radar ring */}
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 44 }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 88,
            height: 88,
            borderRadius: 44,
            borderWidth: 2,
            borderColor: GREEN,
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          }}
        />
        {/* Scan button */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: GREEN,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="scan" size={34} color="white" />
        </View>
      </View>

      {/* Instruction row */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingVertical: 14,
          backgroundColor: 'rgba(255,255,255,0.06)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ThemedText size="sm" weight="semibold" variant="inverse">
          Tap to scan
        </ThemedText>
        <ThemedText size="xs" variant="inverse" style={{ opacity: 0.45 }}>
          Apple · Banana · Mango · Orange · Grape
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
