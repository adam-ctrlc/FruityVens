import React from 'react';
import { View } from 'react-native';
import { ThemedText, FruitAvatar } from '@/components/atoms';

interface BarChartRowProps {
  fruitId: string;
  label: string;
  value: number;
  maxValue: number;
  displayValue: string;
  marginLabel?: string;
}

function BarChartRow({ fruitId, label, value, maxValue, displayValue, marginLabel }: BarChartRowProps) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
      <FruitAvatar fruitId={fruitId} size={28} />
      <ThemedText size="xs" style={{ width: 72 }} numberOfLines={1}>{label}</ThemedText>
      <View className="flex-1 bg-slate-100 rounded-full h-2.5">
        <View className="bg-green-500 rounded-full h-2.5" style={{ width: `${Math.max(pct, 2)}%` }} />
      </View>
      <ThemedText size="xs" weight="semibold" style={{ width: 44, textAlign: 'right' }}>{displayValue}</ThemedText>
      {marginLabel && (
        <ThemedText size="xs" variant="primary" style={{ width: 36, textAlign: 'right' }}>{marginLabel}</ThemedText>
      )}
    </View>
  );
}

export default React.memo(BarChartRow);
