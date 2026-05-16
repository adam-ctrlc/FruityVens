import React, { useMemo } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScanZone } from '@/components/molecules';
import { TransactionItem } from '@/components/molecules';
import { ThemedText } from '@/components/atoms';
import { Header } from '@/components/organisms';
import { Fruit, Transaction } from '@/types';

interface ScanScreenProps {
  fruits: Fruit[];
  transactions: Transaction[];
  onScan: () => void;
  onViewHistory: () => void;
}

export default function ScanScreen({ fruits, transactions, onScan, onViewHistory }: ScanScreenProps) {
  const stats = useMemo(() => {
    const revenue = transactions.reduce((s, t) => s + t.total, 0);
    const profit = transactions.reduce((s, t) => {
      const fruit = fruits.find(f => f.id === t.fruitId);
      return s + (t.total - (fruit?.costPrice ?? 0) * t.quantity);
    }, 0);
    return { revenue, profit, count: transactions.length };
  }, [transactions, fruits]);

  const recent = transactions.slice(0, 3);

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  return (
    <>
      <Header
        logo={require('../../assets/logo.png')}
        title="FruityVens"
        subtitle={dateLabel}
      />

      <ScrollView
        className="flex-1 bg-slate-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-4 pt-5">
          {/* Primary action: Scan Zone */}
          <ScanZone onPress={onScan} />

          {/* Today's quick stats */}
          <View
            className="bg-white border border-slate-100 rounded-2xl mt-4 px-5 py-4 flex-row items-center"
            style={{ gap: 0 }}
          >
            <View className="flex-1 items-center">
              <ThemedText size="lg" weight="bold" style={{ color: '#16a34a' }}>
                ₱{stats.revenue.toFixed(2)}
              </ThemedText>
              <ThemedText size="xs" style={{ color: '#94a3b8', marginTop: 2 }}>Revenue</ThemedText>
            </View>
            <View style={{ width: 1, height: 32, backgroundColor: '#f1f5f9' }} />
            <View className="flex-1 items-center">
              <ThemedText size="lg" weight="bold" style={{ color: '#1e293b' }}>
                {stats.count}
              </ThemedText>
              <ThemedText size="xs" style={{ color: '#94a3b8', marginTop: 2 }}>Scans Today</ThemedText>
            </View>
            <View style={{ width: 1, height: 32, backgroundColor: '#f1f5f9' }} />
            <View className="flex-1 items-center">
              <ThemedText size="lg" weight="bold" style={{ color: '#1e293b' }}>
                ₱{stats.profit.toFixed(2)}
              </ThemedText>
              <ThemedText size="xs" style={{ color: '#94a3b8', marginTop: 2 }}>Profit</ThemedText>
            </View>
          </View>

          {/* Recent scans */}
          <View className="mt-5">
            <View className="flex-row items-center justify-between mb-3">
              <ThemedText size="sm" weight="bold" style={{ color: '#1e293b' }}>
                Recent
              </ThemedText>
              {transactions.length > 3 && (
                <TouchableOpacity
                  onPress={onViewHistory}
                  className="flex-row items-center"
                  style={{ gap: 2 }}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <ThemedText size="xs" weight="medium" style={{ color: '#16a34a' }}>View all</ThemedText>
                  <Ionicons name="chevron-forward" size={13} color="#16a34a" />
                </TouchableOpacity>
              )}
            </View>

            {recent.length === 0 ? (
              <View
                className="bg-white border border-slate-100 rounded-2xl items-center py-10"
                style={{ gap: 10 }}
              >
                <View
                  className="w-14 h-14 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <Ionicons name="scan-outline" size={28} color="#94a3b8" />
                </View>
                <ThemedText weight="semibold" style={{ color: '#334155' }}>
                  No scans yet today
                </ThemedText>
                <ThemedText size="sm" style={{ color: '#94a3b8' }}>
                  Tap the scanner above to get started
                </ThemedText>
              </View>
            ) : (
              recent.map(t => <TransactionItem key={t.id} transaction={t} />)
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
