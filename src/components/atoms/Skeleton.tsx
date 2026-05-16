import React, { useEffect, useRef } from 'react';
import { Animated, type DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}

export default function Skeleton({ width = '100%', height = 16, radius = 8 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.75, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 750, useNativeDriver: true }),
      ]),
    ).start();
    return () => opacity.stopAnimation();
  }, []);

  return (
    <Animated.View
      style={{ opacity, width, height, borderRadius: radius, backgroundColor: '#BBF7D0' }}
    />
  );
}
