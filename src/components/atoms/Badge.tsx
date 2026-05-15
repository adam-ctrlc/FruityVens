import React from 'react';
import { View } from 'react-native';
import ThemedText from './ThemedText';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
}

const containerClasses = {
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  danger: 'bg-red-100',
  neutral: 'bg-gray-100',
};

const textVariantMap: Record<string, 'primary' | 'muted' | 'danger'> = {
  success: 'primary',
  warning: 'muted',
  danger: 'danger',
  neutral: 'muted',
};

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <View className={`${containerClasses[variant]} px-2 py-0.5 rounded-full self-start`}>
      <ThemedText size="xs" weight="medium" variant={textVariantMap[variant]}>
        {label}
      </ThemedText>
    </View>
  );
}
