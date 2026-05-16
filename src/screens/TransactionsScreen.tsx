import React from 'react';
import { FlatList, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/organisms';
import { TransactionItem } from '@/components/molecules';
import { ThemedText } from '@/components/atoms';
import { transactions } from '@/data/mockData';

export default function TransactionsScreen() {
  const sorted = [...transactions].reverse();
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <>
      <Header title="Transactions" subtitle={`₱${totalRevenue.toFixed(2)} earned today`} />
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={sorted}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
              <ThemedText variant="muted" className="mt-2">No transactions yet</ThemedText>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </>
  );
}
