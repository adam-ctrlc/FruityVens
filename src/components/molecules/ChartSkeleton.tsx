import React from 'react';
import { View } from 'react-native';
import Skeleton from '@/components/atoms/Skeleton';
import { ThemedText } from '@/components/atoms';

interface ChartSkeletonProps {
  title?: string;
  rows?: number;
}

export default function ChartSkeleton({ title, rows = 5 }: ChartSkeletonProps) {
  return (
    <View className="bg-white border border-slate-100 rounded-2xl p-4" style={{ gap: 12 }}>
      {title ? (
        <ThemedText size="base" weight="bold">{title}</ThemedText>
      ) : (
        <Skeleton width={140} height={18} radius={5} />
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row items-center" style={{ gap: 8 }}>
          <Skeleton width={28} height={28} radius={14} />
          <Skeleton width={60} height={12} radius={4} />
          <Skeleton
            width={`${[80, 55, 100, 40, 70, 30, 90, 50][i % 8]}%`}
            height={10}
            radius={5}
          />
          <Skeleton width={36} height={12} radius={4} />
        </View>
      ))}
    </View>
  );
}
