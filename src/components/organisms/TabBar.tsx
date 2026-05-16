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
  { key: 'scan',      label: 'Scan',     icon: 'scan-outline',        iconActive: 'scan' },
  { key: 'inventory', label: 'Stock',    icon: 'cube-outline',        iconActive: 'cube' },
  { key: 'history',   label: 'Logs',     icon: 'time-outline',        iconActive: 'time' },
  { key: 'analytics', label: 'Stats',    icon: 'stats-chart-outline', iconActive: 'stats-chart' },
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
      className="flex-row bg-white border-t border-slate-100"
      style={{ paddingBottom: insets.bottom || 8 }}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        const isScan = tab.key === 'scan';

        if (isScan) {
          // Scan tab: elevated pill-style indicator
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              className="flex-1 items-center pt-2 pb-1"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel="Scan tab"
            >
              <View
                style={{
                  width: 52,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isActive ? '#16a34a' : '#f1f5f9',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={20}
                  color={isActive ? 'white' : '#94a3b8'}
                />
              </View>
              <ThemedText
                size="xs"
                weight={isActive ? 'semibold' : 'normal'}
                style={{ color: isActive ? '#16a34a' : '#94a3b8', marginTop: 2 }}
              >
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            className="flex-1 items-center pt-2 pb-1"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <View
              className={`w-12 h-8 rounded-2xl items-center justify-center ${isActive ? 'bg-green-50' : ''}`}
              style={{ position: 'relative' }}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? '#16a34a' : '#94a3b8'}
              />
              {tab.key === 'inventory' && lowStockCount > 0 && (
                <View
                  className="bg-red-500 rounded-full items-center justify-center"
                  style={{ position: 'absolute', top: -2, right: 4, width: 15, height: 15 }}
                >
                  <ThemedText size="xs" variant="inverse" style={{ fontSize: 9, lineHeight: 11 }}>
                    {lowStockCount > 9 ? '9+' : lowStockCount}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText
              size="xs"
              weight={isActive ? 'semibold' : 'normal'}
              style={{ color: isActive ? '#16a34a' : '#94a3b8', marginTop: 2 }}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
