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

function stockStatus(stock: number): { label: string; variant: 'success' | 'warning' | 'danger' } {
  if (stock > 30) return { label: 'In Stock', variant: 'success' };
  if (stock > 10) return { label: 'Low Stock', variant: 'warning' };
  return { label: 'Critical', variant: 'danger' };
}

function FruitCard({ fruit, onPress, onEdit }: FruitCardProps) {
  const status = stockStatus(fruit.stock);
  const margin = Math.round(((fruit.price - fruit.costPrice) / fruit.price) * 100);
  return (
    <TouchableOpacity
      onPress={() => onPress?.(fruit)}
      className="bg-white border border-green-100 rounded-2xl p-4 m-1.5 flex-1"
      activeOpacity={0.7}
    >
      {onEdit && (
        <TouchableOpacity
          onPress={() => onEdit(fruit)}
          className="absolute top-2 right-2 w-7 h-7 items-center justify-center"
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="create-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
      <View className="items-center">
        <FruitAvatar fruitId={fruit.id} size={48} />
      </View>
      <ThemedText size="sm" weight="semibold" className="mt-2 text-center">{fruit.name}</ThemedText>
      <ThemedText size="base" weight="bold" variant="primary" className="text-center mt-0.5">
        ${fruit.price.toFixed(2)}/{fruit.unit}
      </ThemedText>
      <ThemedText size="xs" variant="muted" className="text-center">
        {fruit.stock} {fruit.unit} · {margin}% margin
      </ThemedText>
      <View className="mt-2 items-center">
        <Badge label={status.label} variant={status.variant} />
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(FruitCard);
