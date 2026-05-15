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
}

export default function DashboardScreen({ transactions, fruits, onAddSale }: DashboardScreenProps) {
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
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <SalesSummary transactions={transactions} fruits={fruits} />
        <View className="mt-5">
          <LowStockSection fruits={fruits} />
        </View>
        <View className="mb-4">
          <ThemedText size="lg" weight="bold" className="mb-3">Recent Sales</ThemedText>
          {recent.length === 0 ? (
            <ThemedText variant="muted" size="sm">No sales yet today.</ThemedText>
          ) : (
            recent.map(t => <TransactionItem key={t.id} transaction={t} />)
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={onAddSale}
        className="bg-green-600 rounded-full items-center justify-center"
        style={{ position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, elevation: 4 }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </>
  );
}
