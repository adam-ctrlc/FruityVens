import React, { useMemo } from 'react';
import { ScrollView, View, Share, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, RevenueChart, WeeklyTrend } from '@/components/organisms';
import AnalyticsSkeleton from '@/components/organisms/skeletons/AnalyticsSkeleton';
import { useFirstLoad } from '@/hooks/useFirstLoad';
import { StatCard } from '@/components/molecules';
import { ThemedText } from '@/components/atoms';
import { Transaction, Fruit } from '@/types';

interface AnalyticsScreenProps {
  transactions: Transaction[];
  fruits: Fruit[];
}

export default function AnalyticsScreen({ transactions, fruits }: AnalyticsScreenProps) {
  const isFirstLoad = useFirstLoad(900);
  const stats = useMemo(() => {
    if (transactions.length === 0) return { avgSale: 0, peakHour: 'N/A', topFruit: '—', totalProfit: 0 };

    const avgSale = transactions.reduce((s, t) => s + t.total, 0) / transactions.length;
    const totalProfit = transactions.reduce((s, t) => {
      const fruit = fruits.find(f => f.id === t.fruitId);
      return s + (t.total - (fruit?.costPrice ?? 0) * t.quantity);
    }, 0);

    const hourBuckets: Record<number, number> = {};
    for (const t of transactions) {
      const h = t.timestamp.getHours();
      hourBuckets[h] = (hourBuckets[h] ?? 0) + 1;
    }
    const peakH = parseInt(Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '0');
    const peakHour = peakH === 0 ? '12 AM' : peakH < 12 ? `${peakH} AM` : peakH === 12 ? '12 PM' : `${peakH - 12} PM`;

    const fruitRevenue: Record<string, { name: string; rev: number }> = {};
    for (const t of transactions) {
      if (!fruitRevenue[t.fruitId]) fruitRevenue[t.fruitId] = { name: t.fruitName, rev: 0 };
      fruitRevenue[t.fruitId].rev += t.total;
    }
    const top = Object.values(fruitRevenue).sort((a, b) => b.rev - a.rev)[0];
    const topFruit = top ? top.name : '—';

    return { avgSale, peakHour, topFruit, totalProfit };
  }, [transactions, fruits]);

  async function handleShare() {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const revenue = transactions.reduce((s, t) => s + t.total, 0);
    const msg = [
      `FruityVens Daily Report — ${date}`,
      ``,
      `Revenue:      $${revenue.toFixed(2)}`,
      `Profit:       $${stats.totalProfit.toFixed(2)}`,
      `Transactions: ${transactions.length}`,
      `Top Fruit:    ${stats.topFruit}`,
      `Peak Hour:    ${stats.peakHour}`,
      `Avg Sale:     $${stats.avgSale.toFixed(2)}`,
    ].join('\n');
    await Share.share({ message: msg });
  }

  if (isFirstLoad) return <AnalyticsSkeleton />;

  return (
    <>
      <Header
        title="Analytics"
        subtitle="Sales insights"
        right={
          <TouchableOpacity onPress={handleShare} className="bg-white/20 rounded-xl px-3 py-1.5 flex-row items-center" style={{ gap: 4 }}>
            <Ionicons name="share-outline" size={16} color="white" />
            <ThemedText size="sm" variant="inverse" weight="semibold">Share</ThemedText>
          </TouchableOpacity>
        }
      />
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <ThemedText size="base" weight="bold" className="mb-3">Key Stats</ThemedText>
        <View className="flex-row mb-3" style={{ gap: 12 }}>
          <StatCard label="Avg Sale" value={`$${stats.avgSale.toFixed(2)}`} icon="cash-outline" />
          <StatCard label="Total Profit" value={`$${stats.totalProfit.toFixed(2)}`} icon="trending-up-outline" />
        </View>
        <View className="flex-row mb-4" style={{ gap: 12 }}>
          <StatCard label="Peak Hour" value={stats.peakHour} icon="time-outline" />
          <StatCard label="Top Fruit" value={stats.topFruit} icon="trophy-outline" />
        </View>
        <RevenueChart transactions={transactions} fruits={fruits} />
        <WeeklyTrend transactions={transactions} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </>
  );
}
