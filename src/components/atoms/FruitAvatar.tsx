import React from 'react';
import { View, Text } from 'react-native';

const FRUIT_META: Record<string, { emoji: string; bg: string }> = {
  '1': { emoji: '🍎', bg: '#F87171' },  // Apple
  '2': { emoji: '🥭', bg: '#FB923C' },  // Mango
  '3': { emoji: '🍌', bg: '#FACC15' },  // Banana
  '4': { emoji: '🍊', bg: '#F97316' },  // Orange
  '5': { emoji: '🍇', bg: '#A78BFA' },  // Grape
  '6': { emoji: '🍉', bg: '#34D399' },  // Watermelon
  '7': { emoji: '🍍', bg: '#FDE047' },  // Pineapple
  '8': { emoji: '🍓', bg: '#F43F5E' },  // Strawberry
};

const FALLBACK = { emoji: '🍽️', bg: '#94A3B8' };

interface FruitAvatarProps {
  fruitId: string;
  size?: number;
}

export default function FruitAvatar({ fruitId, size = 40 }: FruitAvatarProps) {
  const meta = FRUIT_META[fruitId] ?? FALLBACK;
  const radius = Math.round(size * 0.3);
  const fontSize = Math.round(size * 0.52);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: meta.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize, lineHeight: size, textAlign: 'center' }}>
        {meta.emoji}
      </Text>
    </View>
  );
}
