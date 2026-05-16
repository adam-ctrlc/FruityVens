import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/atoms';

interface FilterToggleProps<T extends string> {
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (value: T) => void;
}

export default function FilterToggle<T extends string>({ options, selected, onSelect }: FilterToggleProps<T>) {
  return (
    <View className="flex-row bg-slate-100 rounded-xl p-1 mb-4" style={{ gap: 4 }}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          className={`flex-1 py-2 rounded-lg items-center ${selected === opt.value ? 'bg-green-600' : 'bg-transparent'}`}
          activeOpacity={0.7}
        >
          <ThemedText
            size="sm"
            weight={selected === opt.value ? 'semibold' : 'normal'}
            variant={selected === opt.value ? 'inverse' : 'muted'}
          >
            {opt.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
