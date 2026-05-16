import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function RowSkeleton() {
  return (
    <View className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex-row items-center justify-between mb-2">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <Skeleton width={40} height={40} radius={20} />
        <View style={{ gap: 6 }}>
          <Skeleton width={80} height={13} radius={4} />
          <Skeleton width={55} height={11} radius={4} />
        </View>
      </View>
      <View className="items-end" style={{ gap: 6 }}>
        <Skeleton width={48} height={13} radius={4} />
        <Skeleton width={34} height={11} radius={4} />
      </View>
    </View>
  );
}

export default function HistorySkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-100 px-5 pb-4" style={{ paddingTop: insets.top + 12, gap: 8 }}>
        <Skeleton width={90} height={28} radius={6} />
        <Skeleton width={170} height={14} radius={4} />
      </View>
      <View className="flex-1 px-4 pt-4">
        {/* Filter toggle */}
        <Skeleton width="100%" height={44} radius={12} />
        {/* Section header */}
        <View className="mt-4 mb-2 flex-row justify-between">
          <Skeleton width={160} height={14} radius={4} />
          <Skeleton width={80} height={14} radius={4} />
        </View>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <View className="mt-2 mb-2 flex-row justify-between">
          <Skeleton width={140} height={14} radius={4} />
          <Skeleton width={70} height={14} radius={4} />
        </View>
        <RowSkeleton />
        <RowSkeleton />
      </View>
    </View>
  );
}
