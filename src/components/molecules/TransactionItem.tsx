import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/atoms';
import { FruitAvatar } from '@/components/atoms';
import { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <View className="bg-white border border-green-50 rounded-xl px-4 py-3 flex-row items-center justify-between mb-2">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <FruitAvatar fruitId={transaction.fruitId} size={40} />
        <View>
          <ThemedText size="sm" weight="semibold">{transaction.fruitName}</ThemedText>
          <ThemedText size="xs" variant="muted">
            {transaction.quantity} {transaction.unit}
          </ThemedText>
        </View>
      </View>
      <View className="items-end">
        <ThemedText size="sm" weight="bold" variant="primary">
          ${transaction.total.toFixed(2)}
        </ThemedText>
        <ThemedText size="xs" variant="muted">
          {formatTime(transaction.timestamp)}
        </ThemedText>
      </View>
    </View>
  );
}

export default React.memo(TransactionItem);
