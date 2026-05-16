import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, SalesSummary, LowStockSection } from '@/components/organisms';
import DashboardSkeleton from '@/components/organisms/skeletons/DashboardSkeleton';
import { TransactionItem } from '@/components/molecules';
import { ThemedText } from '@/components/atoms';
import { Transaction, Fruit } from '@/types';
import { useFirstLoad } from '@/hooks/useFirstLoad';

interface DashboardScreenProps {
  transactions: Transaction[];
  fruits: Fruit[];
  onAddSale: () => void;
  onScan: () => void;
}

export default function DashboardScreen({ transactions, fruits, onAddSale, onScan }: DashboardScreenProps) {
  const isFirstLoad = useFirstLoad(900);
  const recent = [...transactions].slice(0, 4);
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  if (isFirstLoad) return <DashboardSkeleton />;

  return (
    <>
      <Header title="FruityVens" subtitle={dateLabel} logo={require('../../assets/logo.png')} />

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Scan & Sell hero card ── */}
        <TouchableOpacity
          onPress={onScan}
          activeOpacity={0.85}
          className="bg-green-600 rounded-2xl p-4 mb-5 flex-row items-center"
          style={{ gap: 14 }}
          accessibilityRole="button"
          accessibilityLabel="Open camera to scan and sell a fruit"
        >
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Ionicons name="scan" size={26} color="white" />
          </View>
          <View className="flex-1">
            <ThemedText size="base" weight="bold" variant="inverse">Scan & Sell</ThemedText>
            <ThemedText size="sm" variant="inverse" style={{ opacity: 0.75 }}>
              Point camera at a fruit to identify it
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* ── Today's stats ── */}
        <SalesSummary transactions={transactions} fruits={fruits} />

        {/* ── Low stock alerts ── */}
        <View className="mt-5">
          <LowStockSection fruits={fruits} />
        </View>

        {/* ── Recent sales ── */}
        <View className="mb-4">
          <ThemedText size="base" weight="bold" className="mb-3" style={{ color: '#1e293b' }}>
            Recent Sales
          </ThemedText>
          {recent.length === 0 ? (
            <View className="items-center py-8" style={{ gap: 8 }}>
              <Ionicons name="receipt-outline" size={36} color="#94a3b8" />
              <ThemedText variant="muted" size="sm">No sales recorded yet today.</ThemedText>
            </View>
          ) : (
            recent.map(t => <TransactionItem key={t.id} transaction={t} />)
          )}
        </View>
      </ScrollView>

      {/* Add Sale FAB */}
      <TouchableOpacity
        onPress={onAddSale}
        className="bg-slate-800 rounded-full items-center justify-center"
        style={{ position: 'absolute', bottom: 24, right: 24, width: 52, height: 52, elevation: 4 }}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add a sale manually"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </>
  );
}
