import React from 'react';
import { View } from 'react-native';
import { ThemedText, FruitAvatar } from '@/components/atoms';
import { RestockEvent } from '@/types';

interface RestockItemProps {
  event: RestockEvent;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function RestockItem({ event }: RestockItemProps) {
  return (
    <View className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex-row items-center justify-between mb-2">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <FruitAvatar fruitId={event.fruitId} size={40} />
        <View>
          <ThemedText size="sm" weight="semibold">{event.fruitName}</ThemedText>
          <ThemedText size="xs" variant="muted">
            +{event.quantity} {event.unit} @ ${event.costPerUnit}/{event.unit}
          </ThemedText>
        </View>
      </View>
      <View className="items-end">
        <ThemedText size="sm" weight="bold" variant="primary">-${event.totalCost.toFixed(2)}</ThemedText>
        <ThemedText size="xs" variant="muted">{formatTime(event.timestamp)}</ThemedText>
      </View>
    </View>
  );
}

export default React.memo(RestockItem);
