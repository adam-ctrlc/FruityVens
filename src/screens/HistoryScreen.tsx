import React from 'react';
import { View } from 'react-native';
import { Header, HistoryList } from '@/components/organisms';
import HistorySkeleton from '@/components/organisms/skeletons/HistorySkeleton';
import { Transaction, Fruit } from '@/types';
import { useFirstLoad } from '@/hooks/useFirstLoad';

interface HistoryScreenProps {
  transactions: Transaction[];
  fruits: Fruit[];
}

export default function HistoryScreen({ transactions, fruits }: HistoryScreenProps) {
  const isFirstLoad = useFirstLoad(900);

  if (isFirstLoad) return <HistorySkeleton />;

  return (
    <>
      <Header title="History" subtitle={`${transactions.length} total transactions`} />
      <View className="flex-1 px-4 pt-4">
        <HistoryList transactions={transactions} fruits={fruits} />
      </View>
    </>
  );
}
