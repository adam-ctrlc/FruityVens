import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Badge, FruitAvatar } from '@/components/atoms';
import { Fruit } from '@/types';

interface FruitCardProps {
  fruit: Fruit;
  onPress?: (fruit: Fruit) => void;
  onEdit?: (fruit: Fruit) => void;
}

const STOCK_MAX = 50;

function stockStatus(stock: number): { label: string; variant: 'success' | 'warning' | 'danger' } {
  if (stock > 30) return { label: 'In Stock', variant: 'success' };
  if (stock > 10) return { label: 'Low Stock', variant: 'warning' };
  return { label: 'Critical', variant: 'danger' };
}

const BAR_COLOR: Record<'success' | 'warning' | 'danger', string> = {
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#ef4444',
};

function FruitCard({ fruit, onPress, onEdit }: FruitCardProps) {
  const status = stockStatus(fruit.stock);
  const margin = Math.round(((fruit.price - fruit.costPrice) / fruit.price) * 100);
  const stockPct = Math.min(Math.max(fruit.stock / STOCK_MAX, 0), 1);
  const barColor = BAR_COLOR[status.variant];

  return (
    <TouchableOpacity
      onPress={() => onPress?.(fruit)}
      className="bg-white border border-slate-100 rounded-2xl px-4 py-3.5 mb-2"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center" style={{ gap: 14 }}>
        <FruitAvatar fruitId={fruit.id} size={52} />

        <View style={{ flex: 1 }}>
          {/* Top row: name + badge + edit */}
          <View className="flex-row items-center justify-between mb-1">
            <ThemedText size="base" weight="semibold" style={{ color: '#1e293b' }}>
              {fruit.name}
            </ThemedText>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <Badge label={status.label} variant={status.variant} />
              {onEdit && (
                <TouchableOpacity
                  onPress={() => onEdit(fruit)}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Ionicons name="create-outline" size={16} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Mid row: price + stock qty + margin */}
          <View className="flex-row items-center justify-between mb-2">
            <ThemedText size="sm" weight="bold" style={{ color: '#16a34a' }}>
              ₱{fruit.price.toFixed(2)}/{fruit.unit}
            </ThemedText>
            <ThemedText size="xs" style={{ color: '#94a3b8' }}>
              {fruit.stock} {fruit.unit} · {margin}% margin
            </ThemedText>
          </View>

          {/* Stock progress bar */}
          <View style={{ height: 5, borderRadius: 3, backgroundColor: '#f1f5f9' }}>
            <View
              style={{
                height: 5,
                borderRadius: 3,
                backgroundColor: barColor,
                width: `${Math.round(stockPct * 100)}%`,
              }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(FruitCard);
