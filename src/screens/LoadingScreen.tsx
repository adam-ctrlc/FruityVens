import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/atoms';

export default function LoadingScreen() {
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-green-600 items-center justify-center">
      <Animated.View style={{ opacity: fadeIn, transform: [{ scale: pulse }] }}>
        <Ionicons name="leaf" size={80} color="white" />
      </Animated.View>

      <Animated.View style={{ opacity: fadeIn }} className="mt-6 items-center">
        <ThemedText size="3xl" weight="bold" variant="inverse">
          FruityVens
        </ThemedText>
        <ThemedText size="sm" variant="inverse" className="opacity-70 mt-1">
          Smart fruit vending
        </ThemedText>
      </Animated.View>

      <Animated.View style={{ opacity: fadeIn }} className="absolute bottom-20 items-center">
        <ThemedText size="xs" variant="inverse" className="opacity-50">
          Loading...
        </ThemedText>
      </Animated.View>
    </View>
  );
}
