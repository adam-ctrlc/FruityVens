import React from 'react';
import { View, ScrollView } from 'react-native';
import { Skeleton } from '@/components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StatSkeleton() {
  return (
    <View className="bg-white border border-green-100 rounded-2xl p-4 flex-1" style={{ gap: 8 }}>
      <Skeleton width={32} height={32} radius={16} />
      <Skeleton width="55%" height={22} radius={6} />
      <Skeleton width="75%" height={12} radius={4} />
    </View>
  );
}

export default function AnalyticsSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-green-50">
      <View className="bg-green-600 px-5 pb-5" style={{ paddingTop: insets.top + 12, gap: 8 }}>
        <Skeleton width={120} height={28} radius={6} />
        <Skeleton width={110} height={14} radius={4} />
      </View>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Skeleton width={80} height={18} radius={5} />
        <View className="flex-row mt-3 mb-3" style={{ gap: 12 }}>
          <StatSkeleton />
          <StatSkeleton />
        </View>
        <View className="flex-row mb-5" style={{ gap: 12 }}>
          <StatSkeleton />
          <StatSkeleton />
        </View>
        {/* Revenue chart */}
        <View className="bg-white border border-green-100 rounded-2xl p-4 mb-4" style={{ gap: 12 }}>
          <Skeleton width={140} height={18} radius={5} />
          {[80, 55, 100, 40, 70, 30, 90, 50].map((w, i) => (
            <View key={i} className="flex-row items-center" style={{ gap: 8 }}>
              <Skeleton width={28} height={28} radius={14} />
              <Skeleton width={60} height={12} radius={4} />
              <Skeleton width={`${w}%`} height={10} radius={5} />
              <Skeleton width={36} height={12} radius={4} />
            </View>
          ))}
        </View>
        {/* Weekly trend */}
        <View className="bg-white border border-green-100 rounded-2xl p-4 mb-4">
          <Skeleton width={120} height={18} radius={5} />
          <View className="flex-row items-end mt-4" style={{ gap: 4 }}>
            {[40, 60, 30, 80, 50, 70, 100].map((h, i) => (
              <View key={i} className="flex-1 items-center" style={{ gap: 4 }}>
                <Skeleton width={24} height={h * 0.8} radius={4} />
                <Skeleton width={20} height={10} radius={3} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
