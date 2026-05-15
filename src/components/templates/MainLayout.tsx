import React from 'react';
import { View } from 'react-native';
import { TabBar } from '@/components/organisms';
import { Screen } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: Screen;
  onTabPress: (tab: Screen) => void;
  lowStockCount?: number;
}

export default function MainLayout({ children, activeTab, onTabPress, lowStockCount = 0 }: MainLayoutProps) {
  return (
    <View className="flex-1 bg-green-50">
      <View className="flex-1">{children}</View>
      <TabBar activeTab={activeTab} onTabPress={onTabPress} lowStockCount={lowStockCount} />
    </View>
  );
}
