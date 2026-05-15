import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/atoms';
import { Screen } from '@/types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Tab {
  key: Screen;
  label: string;
  icon: IoniconName;
  iconActive: IoniconName;
}

const tabs: Tab[] = [
  { key: 'dashboard',  label: 'Dashboard', icon: 'grid-outline',        iconActive: 'grid' },
  { key: 'inventory',  label: 'Inventory',  icon: 'cube-outline',        iconActive: 'cube' },
  { key: 'history',    label: 'History',    icon: 'time-outline',        iconActive: 'time' },
  { key: 'analytics',  label: 'Analytics',  icon: 'stats-chart-outline', iconActive: 'stats-chart' },
];

interface TabBarProps {
  activeTab: Screen;
  onTabPress: (tab: Screen) => void;
  lowStockCount?: number;
}

export default function TabBar({ activeTab, onTabPress, lowStockCount = 0 }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row bg-white border-t border-green-100"
      style={{ paddingBottom: insets.bottom || 8 }}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            className="flex-1 items-center pt-3 pb-1"
            activeOpacity={0.7}
          >
            <View>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? '#16a34a' : '#9CA3AF'}
              />
              {tab.key === 'inventory' && lowStockCount > 0 && (
                <View
                  className="bg-red-500 rounded-full items-center justify-center"
                  style={{ position: 'absolute', top: -4, right: -6, width: 16, height: 16 }}
                >
                  <ThemedText size="xs" variant="inverse" style={{ fontSize: 10, lineHeight: 12 }}>
                    {lowStockCount > 9 ? '9+' : lowStockCount}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText
              size="xs"
              weight={isActive ? 'semibold' : 'normal'}
              variant={isActive ? 'primary' : 'muted'}
              className="mt-0.5"
            >
              {tab.label}
            </ThemedText>
            {isActive && <View className="w-1 h-1 rounded-full bg-green-600 mt-1" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
