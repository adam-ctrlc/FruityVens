import React, { useMemo } from 'react';
import { Modal, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Button, Badge, FruitAvatar } from '@/components/atoms';
import { TransactionItem } from '@/components/molecules';
import { Fruit, Transaction } from '@/types';

interface FruitDetailModalProps {
  visible: boolean;
  fruit: Fruit | null;
  transactions: Transaction[];
  onClose: () => void;
  onAddSale: (fruit: Fruit) => void;
}

function stockVariant(stock: number): 'success' | 'warning' | 'danger' {
  if (stock > 30) return 'success';
  if (stock > 10) return 'warning';
  return 'danger';
}

function stockLabel(stock: number): string {
  if (stock > 30) return 'In Stock';
  if (stock > 10) return 'Low Stock';
  return 'Critical';
}

export default function FruitDetailModal({ visible, fruit, transactions, onClose, onAddSale }: FruitDetailModalProps) {
  const recentSales = useMemo(() => {
    if (!fruit) return [];
    return transactions
      .filter(t => t.fruitId === fruit.id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  }, [fruit, transactions]);

  if (!fruit) return null;

  const margin = Math.round(((fruit.price - fruit.costPrice) / fruit.price) * 100);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-green-100">
            <ThemedText size="xl" weight="bold">Fruit Details</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Ionicons name="close" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
            <View className="items-center mb-5">
              <FruitAvatar fruitId={fruit.id} size={80} />
              <ThemedText size="2xl" weight="bold" className="mt-3">{fruit.name}</ThemedText>
              <Badge label={stockLabel(fruit.stock)} variant={stockVariant(fruit.stock)} />
            </View>

            <View className="flex-row mb-4" style={{ gap: 12 }}>
              <View className="flex-1 bg-green-50 rounded-xl p-3 items-center">
                <ThemedText size="xs" variant="muted">Sell Price</ThemedText>
                <ThemedText size="lg" weight="bold" variant="primary">${fruit.price.toFixed(2)}</ThemedText>
                <ThemedText size="xs" variant="muted">per {fruit.unit}</ThemedText>
              </View>
              <View className="flex-1 bg-amber-50 rounded-xl p-3 items-center">
                <ThemedText size="xs" variant="muted">Cost Price</ThemedText>
                <ThemedText size="lg" weight="bold">${fruit.costPrice.toFixed(2)}</ThemedText>
                <ThemedText size="xs" variant="muted">per {fruit.unit}</ThemedText>
              </View>
              <View className="flex-1 bg-green-50 rounded-xl p-3 items-center">
                <ThemedText size="xs" variant="muted">Margin</ThemedText>
                <ThemedText size="lg" weight="bold" variant="primary">{margin}%</ThemedText>
                <ThemedText size="xs" variant="muted">profit</ThemedText>
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-3 mb-4 flex-row items-center justify-between">
              <ThemedText size="sm" variant="muted">Current Stock</ThemedText>
              <ThemedText size="sm" weight="bold">{fruit.stock} {fruit.unit}</ThemedText>
            </View>

            {recentSales.length > 0 && (
              <View className="mb-4">
                <ThemedText size="sm" weight="semibold" className="mb-2">Recent Sales</ThemedText>
                {recentSales.map(t => <TransactionItem key={t.id} transaction={t} />)}
              </View>
            )}

            <Button label="Add Sale" onPress={() => onAddSale(fruit)} fullWidth />
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
