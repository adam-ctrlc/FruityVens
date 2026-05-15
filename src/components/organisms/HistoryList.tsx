import React, { useMemo, useState, useCallback } from 'react';
import { SectionList, View, SectionListRenderItem } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/atoms';
import { TransactionItem, DaySectionHeader, FilterToggle } from '@/components/molecules';
import { Transaction, DaySection, HistoryFilter, Fruit } from '@/types';

interface HistoryListProps {
  transactions: Transaction[];
  fruits: Fruit[];
}

const FILTER_OPTIONS: { label: string; value: HistoryFilter }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'All', value: 'all' },
];

function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function toDisplayDate(key: string): string {
  return new Date(key + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

export default function HistoryList({ transactions, fruits }: HistoryListProps) {
  const [filter, setFilter] = useState<HistoryFilter>('today');

  const sections = useMemo<DaySection[]>(() => {
    const today = toDateKey(new Date());
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weekAgoKey = toDateKey(weekAgo);

    const filtered = transactions.filter(t => {
      const key = toDateKey(t.timestamp);
      if (filter === 'today') return key === today;
      if (filter === 'week') return key >= weekAgoKey;
      return true;
    });

    const groups: Record<string, Transaction[]> = {};
    for (const t of filtered) {
      const key = toDateKey(t.timestamp);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    }

    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(key => {
        const data = groups[key].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const dailyRevenue = data.reduce((s, t) => s + t.total, 0);
        const dailyProfit = data.reduce((s, t) => {
          const fruit = fruits.find(f => f.id === t.fruitId);
          const costPerUnit = fruit?.costPrice ?? 0;
          return s + (t.total - costPerUnit * t.quantity);
        }, 0);
        return { title: key, displayDate: toDisplayDate(key), dailyRevenue, dailyProfit, data };
      });
  }, [transactions, fruits, filter]);

  const renderItem = useCallback<SectionListRenderItem<Transaction, DaySection>>(
    ({ item }) => <TransactionItem transaction={item} />,
    [],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: DaySection }) => (
      <DaySectionHeader
        displayDate={section.displayDate}
        dailyRevenue={section.dailyRevenue}
        dailyProfit={section.dailyProfit}
      />
    ),
    [],
  );

  return (
    <View className="flex-1">
      <FilterToggle options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />
      {sections.length === 0 ? (
        <View className="flex-1 items-center justify-center py-16">
          <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
          <ThemedText variant="muted" className="mt-2">No transactions found</ThemedText>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          ItemSeparatorComponent={null}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
        />
      )}
    </View>
  );
}
