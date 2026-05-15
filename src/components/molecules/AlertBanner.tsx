import React from 'react';
import { View } from 'react-native';
import { ThemedText, FruitAvatar } from '@/components/atoms';
import { Fruit } from '@/types';

interface AlertBannerProps {
  fruit: Fruit;
}

function AlertBanner({ fruit }: AlertBannerProps) {
  const isCritical = fruit.stock < 10;
  return (
    <View
      className={`rounded-xl px-3 py-2.5 mr-2 border ${isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}
      style={{ minWidth: 120 }}
    >
      <View className="items-center">
        <FruitAvatar fruitId={fruit.id} size={40} />
      </View>
      <ThemedText size="xs" weight="semibold" className="text-center mt-1">{fruit.name}</ThemedText>
      <ThemedText size="xs" variant={isCritical ? 'danger' : 'muted'} className="text-center">
        {fruit.stock} {fruit.unit} left
      </ThemedText>
    </View>
  );
}

export default React.memo(AlertBanner);
