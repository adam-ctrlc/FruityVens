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
      className="bg-green-600 px-5 pb-5"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          {logo ? (
            <Image
              source={logo}
              style={{ height: 40, width: 140 }}
              resizeMode="contain"
            />
          ) : (
            <ThemedText size="2xl" weight="bold" variant="inverse">{title}</ThemedText>
          )}
          {subtitle && (
            <ThemedText size="sm" variant="inverse" className="opacity-80 mt-0.5">
              {subtitle}
            </ThemedText>
          )}
        </View>
        {right && <View>{right}</View>}
      </View>
    </View>
  );
}
