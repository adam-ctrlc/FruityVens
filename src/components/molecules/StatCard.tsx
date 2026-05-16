import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/atoms';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface StatCardProps {
  label: string;
  value: string;
  icon: IoniconName;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ label, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <View className="bg-white border border-slate-100 rounded-2xl p-4 flex-1">
      <Ionicons name={icon} size={26} color="#16a34a" />
      <ThemedText size="2xl" weight="bold" className="mt-2">{value}</ThemedText>
      <ThemedText size="xs" variant="muted" className="mt-0.5">{label}</ThemedText>
      {trend && (
        <View className="flex-row items-center mt-1" style={{ gap: 2 }}>
          <Ionicons
            name={trendUp ? 'arrow-up' : 'arrow-down'}
            size={11}
            color={trendUp ? '#16a34a' : '#ef4444'}
          />
          <ThemedText size="xs" weight="medium" variant={trendUp ? 'primary' : 'danger'}>
            {trend}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export default React.memo(StatCard);
