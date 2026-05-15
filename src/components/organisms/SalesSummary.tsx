import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/atoms';
import { StatCard } from '@/components/molecules';
import { Transaction, Fruit } from '@/types';

interface SalesSummaryProps {
  transactions: Transaction[];
  fruits: Fruit[];
}

export default function SalesSummary({ transactions, fruits }: SalesSummaryProps) {
  const revenue = transactions.reduce((s, t) => s + t.total, 0);
  const profit = transactions.reduce((s, t) => {
    const fruit = fruits.find(f => f.id === t.fruitId);
    return s + (t.total - (fruit?.costPrice ?? 0) * t.quantity);
  }, 0);
  const uniqueFruitsSold = new Set(transactions.map(t => t.fruitId)).size;

  return (
    <View>
      <ThemedText size="lg" weight="bold" className="mb-3">Today's Overview</ThemedText>
      <View className="flex-row" style={{ gap: 12 }}>
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} icon="cash-outline" trend="12% vs yesterday" trendUp />
        <StatCard label="Profit" value={`$${profit.toFixed(2)}`} icon="trending-up-outline" />
      </View>
      <View className="flex-row mt-3" style={{ gap: 12 }}>
        <StatCard label="Transactions" value={String(transactions.length)} icon="receipt-outline" />
        <StatCard label="Fruits Sold" value={String(uniqueFruitsSold)} icon="nutrition-outline" />
      </View>
    </View>
  );
}
