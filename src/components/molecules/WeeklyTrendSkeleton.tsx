import React from 'react';
import { View } from 'react-native';
import Skeleton from '@/components/atoms/Skeleton';
import { ThemedText } from '@/components/atoms';

interface WeeklyTrendSkeletonProps {
  title?: string;
}

const HEIGHTS = [40, 60, 30, 80, 50, 70, 100];

export default function WeeklyTrendSkeleton({ title }: WeeklyTrendSkeletonProps) {
  return (
    <View className="bg-white border border-green-100 rounded-2xl p-4" style={{ gap: 12 }}>
      {title ? (
        <ThemedText size="base" weight="bold">{title}</ThemedText>
      ) : (
        <Skeleton width={120} height={18} radius={5} />
      )}
      <View className="flex-row items-end" style={{ gap: 4 }}>
        {HEIGHTS.map((h, i) => (
          <View key={i} className="flex-1 items-center" style={{ gap: 4 }}>
            <Skeleton width={24} height={h * 0.8} radius={4} />
            <Skeleton width={20} height={10} radius={3} />
          </View>
        ))}
      </View>
    </View>
  );
}
