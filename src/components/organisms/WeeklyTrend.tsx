import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/atoms';
import { WeeklyBar } from '@/components/molecules';
import { Transaction } from '@/types';

interface WeeklyTrendProps {
  transactions: Transaction[];
}

function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function WeeklyTrend({ transactions }: WeeklyTrendProps) {
  const bars = useMemo(() => {
    const today = new Date();
    const todayKey = toDateKey(today);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const key = toDateKey(d);
      const revenue = transactions
        .filter(t => toDateKey(t.timestamp) === key)
        .reduce((s, t) => s + t.total, 0);
      return {
        key,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        revenue,
        isToday: key === todayKey,
      };
    });
  }, [transactions]);

  const maxRevenue = Math.max(...bars.map(b => b.revenue), 1);

  return (
    <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-4">
      <ThemedText size="base" weight="bold" className="mb-4">Weekly Revenue</ThemedText>
      <View className="flex-row items-end" style={{ gap: 4 }}>
        {bars.map(b => (
          <WeeklyBar
            key={b.key}
            day={b.day}
            revenue={b.revenue}
            maxRevenue={maxRevenue}
            isToday={b.isToday}
          />
        ))}
      </View>
    </View>
  );
}
