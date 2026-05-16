import React from 'react';
import { View, ScrollView } from 'react-native';
import { Skeleton } from '@/components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StatCardSkeleton() {
  return (
    <View className="bg-white border border-slate-100 rounded-2xl p-4 flex-1" style={{ gap: 8 }}>
      <Skeleton width={32} height={32} radius={16} />
      <Skeleton width="60%" height={22} radius={6} />
      <Skeleton width="80%" height={12} radius={4} />
    </View>
  );
}

function TransactionSkeleton() {
  return (
    <View className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex-row items-center justify-between mb-2">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <Skeleton width={40} height={40} radius={20} />
        <View style={{ gap: 6 }}>
          <Skeleton width={90} height={13} radius={4} />
          <Skeleton width={60} height={11} radius={4} />
        </View>
      </View>
      <View className="items-end" style={{ gap: 6 }}>
        <Skeleton width={50} height={13} radius={4} />
        <Skeleton width={36} height={11} radius={4} />
      </View>
    </View>
  );
}

export default function DashboardSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-slate-50">
      {/* Header skeleton */}
      <View className="bg-white border-b border-slate-100 px-5 pb-4" style={{ paddingTop: insets.top + 12, gap: 8 }}>
        <Skeleton width={160} height={28} radius={6} />
        <Skeleton width={200} height={14} radius={4} />
      </View>
      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Skeleton width={130} height={18} radius={5} />
        <View className="flex-row mt-3 mb-3" style={{ gap: 12 }}>
          <StatCardSkeleton />
          <StatCardSkeleton />
        </View>
        <View className="flex-row mb-5" style={{ gap: 12 }}>
          <StatCardSkeleton />
          <StatCardSkeleton />
        </View>
        {/* Recent sales label */}
        <Skeleton width={110} height={18} radius={5} />
        <View className="mt-3">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </View>
      </ScrollView>
    </View>
  );
}
