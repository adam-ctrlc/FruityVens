import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/atoms';

const MAX_HEIGHT = 80;

interface WeeklyBarProps {
  day: string;
  revenue: number;
  maxRevenue: number;
  isToday: boolean;
}

export default function WeeklyBar({ day, revenue, maxRevenue, isToday }: WeeklyBarProps) {
  const height = maxRevenue > 0 ? Math.max((revenue / maxRevenue) * MAX_HEIGHT, revenue > 0 ? 4 : 0) : 0;
  return (
    <View className="items-center flex-1" style={{ gap: 4 }}>
      <ThemedText size="xs" weight={isToday ? 'semibold' : 'normal'} variant={isToday ? 'primary' : 'muted'}>
        ${revenue.toFixed(0)}
      </ThemedText>
      <View style={{ height: MAX_HEIGHT, justifyContent: 'flex-end' }}>
        <View
          className={`w-6 rounded-t-md ${isToday ? 'bg-green-600' : 'bg-green-300'}`}
          style={{ height: Math.max(height, 2) }}
        />
      </View>
      <ThemedText size="xs" weight={isToday ? 'semibold' : 'normal'} variant={isToday ? 'primary' : 'muted'}>
        {day}
      </ThemedText>
    </View>
  );
}
