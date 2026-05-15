import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/atoms';
import { BarChartRow } from '@/components/molecules';
import { Transaction, Fruit, FruitStat } from '@/types';

interface RevenueChartProps {
  transactions: Transaction[];
  fruits: Fruit[];
}

export default function RevenueChart({ transactions, fruits }: RevenueChartProps) {
  const stats = useMemo<FruitStat[]>(() => {
    const map: Record<string, FruitStat> = {};
    for (const t of transactions) {
      const fruit = fruits.find(f => f.id === t.fruitId);
      const costPerUnit = fruit?.costPrice ?? 0;
      if (!map[t.fruitId]) {
        map[t.fruitId] = {
          fruitId: t.fruitId,
          fruitName: t.fruitName,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          totalQuantity: 0,
          transactionCount: 0,
        };
      }
      const cost = costPerUnit * t.quantity;
      map[t.fruitId].totalRevenue += t.total;
      map[t.fruitId].totalCost += cost;
      map[t.fruitId].totalProfit += t.total - cost;
      map[t.fruitId].totalQuantity += t.quantity;
      map[t.fruitId].transactionCount += 1;
    }
    return Object.values(map).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [transactions, fruits]);

  const maxRevenue = stats[0]?.totalRevenue ?? 1;

  return (
    <View className="bg-white border border-green-100 rounded-2xl p-4 mb-4">
      <ThemedText size="base" weight="bold" className="mb-4">Revenue by Fruit</ThemedText>
      {stats.length === 0 ? (
        <ThemedText variant="muted" size="sm">No sales recorded yet.</ThemedText>
      ) : (
        stats.map(s => {
          const margin = s.totalRevenue > 0 ? Math.round((s.totalProfit / s.totalRevenue) * 100) : 0;
          return (
            <BarChartRow
              key={s.fruitId}
              fruitId={s.fruitId}
              label={s.fruitName}
              value={s.totalRevenue}
              maxValue={maxRevenue}
              displayValue={`$${s.totalRevenue.toFixed(0)}`}
              marginLabel={`${margin}%`}
            />
          );
        })
      )}
    </View>
  );
}
