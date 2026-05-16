import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function FruitCardSkeleton() {
  return (
    <View className="bg-white border border-slate-100 rounded-2xl p-4 m-1.5 flex-1" style={{ gap: 8, alignItems: 'center' }}>
      <Skeleton width={48} height={48} radius={24} />
      <Skeleton width="70%" height={13} radius={4} />
      <Skeleton width="55%" height={16} radius={4} />
      <Skeleton width="65%" height={11} radius={4} />
      <Skeleton width={64} height={20} radius={10} />
    </View>
  );
}

export default function InventorySkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-100 px-5 pb-4" style={{ paddingTop: insets.top + 12, gap: 8 }}>
        <Skeleton width={110} height={28} radius={6} />
        <Skeleton width={160} height={14} radius={4} />
      </View>
      <View className="flex-1 px-4 pt-4" style={{ gap: 12 }}>
        {/* Search bar */}
        <Skeleton width="100%" height={48} radius={12} />
        {/* Grid */}
        <View className="flex-row">
          <FruitCardSkeleton />
          <FruitCardSkeleton />
        </View>
        <View className="flex-row">
          <FruitCardSkeleton />
          <FruitCardSkeleton />
        </View>
        <View className="flex-row">
          <FruitCardSkeleton />
          <FruitCardSkeleton />
        </View>
      </View>
    </View>
  );
}
