import React from 'react';
import { View } from 'react-native';
import Skeleton from '@/components/atoms/Skeleton';

export default function StatCardSkeleton() {
  return (
    <View className="bg-white border border-green-100 rounded-2xl p-4 flex-1" style={{ gap: 8 }}>
      <Skeleton width={32} height={32} radius={16} />
      <Skeleton width="60%" height={22} radius={6} />
      <Skeleton width="80%" height={12} radius={4} />
    </View>
  );
}
