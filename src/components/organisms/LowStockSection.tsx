import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/atoms';
import { AlertBanner } from '@/components/molecules';
import { Fruit } from '@/types';

interface LowStockSectionProps {
  fruits: Fruit[];
}

export default function LowStockSection({ fruits }: LowStockSectionProps) {
  const alerts = useMemo(
    () => fruits.filter(f => f.stock <= 30).sort((a, b) => a.stock - b.stock),
    [fruits],
  );

  if (alerts.length === 0) return null;

  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
        <ThemedText size="lg" weight="bold">Stock Alerts</ThemedText>
        <View className="bg-red-500 rounded-full px-1.5 py-0.5">
          <ThemedText size="xs" variant="inverse" weight="bold">{alerts.length}</ThemedText>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {alerts.map(fruit => <AlertBanner key={fruit.id} fruit={fruit} />)}
      </ScrollView>
    </View>
  );
}
