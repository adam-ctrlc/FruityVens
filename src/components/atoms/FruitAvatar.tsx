import React from 'react';
import { View } from 'react-native';
import ThemedText from './ThemedText';

const FRUIT_META: Record<string, { initials: string; bg: string; text: string }> = {
  '1': { initials: 'Ap', bg: '#FED7D7', text: '#C53030' },
  '2': { initials: 'Mn', bg: '#FEEBC8', text: '#C05621' },
  '3': { initials: 'Ba', bg: '#FEFCBF', text: '#B7791F' },
  '4': { initials: 'Or', bg: '#FEEBC8', text: '#DD6B20' },
  '5': { initials: 'Gr', bg: '#E9D8FD', text: '#6B46C1' },
  '6': { initials: 'Wm', bg: '#C6F6D5', text: '#276749' },
  '7': { initials: 'Pi', bg: '#FEFCBF', text: '#975A16' },
  '8': { initials: 'Sb', bg: '#FED7D7', text: '#9B2C2C' },
};

const FALLBACK = { initials: '??', bg: '#E2E8F0', text: '#4A5568' };

interface FruitAvatarProps {
  fruitId: string;
  size?: number;
}

export default function FruitAvatar({ fruitId, size = 40 }: FruitAvatarProps) {
  const meta = FRUIT_META[fruitId] ?? FALLBACK;
  const fontSize = Math.round(size * 0.33);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: meta.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ThemedText style={{ fontSize, fontWeight: '700', color: meta.text, lineHeight: fontSize + 2 }}>
        {meta.initials}
      </ThemedText>
    </View>
  );
}
