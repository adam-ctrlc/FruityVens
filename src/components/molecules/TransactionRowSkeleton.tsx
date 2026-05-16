import React from 'react';
import { View } from 'react-native';
import Skeleton from '@/components/atoms/Skeleton';

interface TransactionRowSkeletonProps {
  count?: number;
}

function Row() {
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

export default function TransactionRowSkeleton({ count = 3 }: TransactionRowSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Row key={i} />
      ))}
    </>
  );
}
