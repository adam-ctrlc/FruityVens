import React, { useEffect } from 'react';
import type { DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}

export default function Skeleton({ width = '100%', height = 16, radius = 8 }: SkeletonProps) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.75, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: '#BBF7D0',
        },
      ]}
    />
  );
}
