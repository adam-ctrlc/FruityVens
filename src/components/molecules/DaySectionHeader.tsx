import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/atoms';

interface DaySectionHeaderProps {
  displayDate: string;
  dailyRevenue: number;
  dailyProfit: number;
}

export default function DaySectionHeader({ displayDate, dailyRevenue, dailyProfit }: DaySectionHeaderProps) {
  return (
    <View className="bg-slate-50 px-4 py-2.5 flex-row items-center justify-between border-b border-slate-100">
      <ThemedText size="sm" weight="semibold" style={{ color: '#334155' }}>{displayDate}</ThemedText>
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <ThemedText size="xs" variant="muted">Rev: <ThemedText size="xs" weight="semibold">₱{dailyRevenue.toFixed(2)}</ThemedText></ThemedText>
        <ThemedText size="xs" variant="muted">Profit: <ThemedText size="xs" weight="semibold" variant="primary">₱{dailyProfit.toFixed(2)}</ThemedText></ThemedText>
      </View>
    </View>
  );
}
