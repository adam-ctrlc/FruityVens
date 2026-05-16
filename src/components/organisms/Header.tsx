import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/atoms';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  logo?: ImageSourcePropType;
}

export default function Header({ title, subtitle, right, logo }: HeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-white border-b border-slate-100 px-5 pb-4"
      style={{ paddingTop: insets.top + 14 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          {logo ? (
            <Image
              source={logo}
              style={{ height: 32, width: 108 }}
              resizeMode="stretch"
            />
          ) : (
            <ThemedText size="xl" weight="bold" style={{ color: '#1e293b' }}>{title}</ThemedText>
          )}
          {subtitle && (
            <ThemedText size="sm" style={{ color: '#64748b', marginTop: 2 }}>
              {subtitle}
            </ThemedText>
          )}
        </View>
        {right && <View>{right}</View>}
      </View>
    </View>
  );
}
