import React, { useMemo, useState } from 'react';
import {
  ScrollView, View, Share, TouchableOpacity, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, RevenueChart, WeeklyTrend } from '@/components/organisms';
import AnalyticsSkeleton from '@/components/organisms/skeletons/AnalyticsSkeleton';
import { useFirstLoad } from '@/hooks/useFirstLoad';
import { StatCard } from '@/components/molecules';
import { ThemedText, Button } from '@/components/atoms';
import { Transaction, Fruit } from '@/types';

interface AnalyticsScreenProps {
  transactions: Transaction[];
  fruits: Fruit[];
}

const CSV_HEADERS = 'Date,Time,Fruit,Quantity,Unit,Price/Unit,Total';
const CSV_TEMPLATE = [
  CSV_HEADERS,
  '2026-05-16,09:30,Apple,2.5,kg,2.50,6.25',
  '2026-05-16,10:00,Mango,1,kg,3.50,3.50',
].join('\n');

export default function AnalyticsScreen({ transactions, fruits }: AnalyticsScreenProps) {
  const isFirstLoad = useFirstLoad(900);
  const [exportVisible, setExportVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);

  const stats = useMemo(() => {
    if (transactions.length === 0) return { avgSale: 0, peakHour: 'N/A', topFruit: '—', totalProfit: 0 };

    const avgSale = transactions.reduce((s, t) => s + t.total, 0) / transactions.length;
    const totalProfit = transactions.reduce((s, t) => {
      const fruit = fruits.find(f => f.id === t.fruitId);
      return s + (t.total - (fruit?.costPrice ?? 0) * t.quantity);
    }, 0);

    const hourBuckets: Record<number, number> = {};
    for (const t of transactions) {
      const h = t.timestamp.getHours();
      hourBuckets[h] = (hourBuckets[h] ?? 0) + 1;
    }
    const peakH = parseInt(Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '0');
    const peakHour = peakH === 0 ? '12 AM' : peakH < 12 ? `${peakH} AM` : peakH === 12 ? '12 PM' : `${peakH - 12} PM`;

    const fruitRevenue: Record<string, { name: string; rev: number }> = {};
    for (const t of transactions) {
      if (!fruitRevenue[t.fruitId]) fruitRevenue[t.fruitId] = { name: t.fruitName, rev: 0 };
      fruitRevenue[t.fruitId].rev += t.total;
    }
    const top = Object.values(fruitRevenue).sort((a, b) => b.rev - a.rev)[0];
    const topFruit = top ? top.name : '—';

    return { avgSale, peakHour, topFruit, totalProfit };
  }, [transactions, fruits]);

  async function shareSummary() {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const revenue = transactions.reduce((s, t) => s + t.total, 0);
    const msg = [
      `FruityVens Daily Report — ${date}`,
      ``,
      `Revenue:      ₱${revenue.toFixed(2)}`,
      `Profit:       ₱${stats.totalProfit.toFixed(2)}`,
      `Transactions: ${transactions.length}`,
      `Top Fruit:    ${stats.topFruit}`,
      `Peak Hour:    ${stats.peakHour}`,
      `Avg Sale:     ₱${stats.avgSale.toFixed(2)}`,
    ].join('\n');
    setExportVisible(false);
    await Share.share({ message: msg });
  }

  async function exportCSV() {
    const rows = transactions.map(t => {
      const d = t.timestamp.toISOString().split('T')[0];
      const time = t.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const price = t.quantity > 0 ? (t.total / t.quantity).toFixed(2) : '0.00';
      return `${d},${time},${t.fruitName},${t.quantity},${t.unit},${price},${t.total.toFixed(2)}`;
    });
    const csv = [CSV_HEADERS, ...rows].join('\n');
    setExportVisible(false);
    await Share.share({ message: csv });
  }

  async function downloadTemplate() {
    setImportVisible(false);
    await Share.share({ message: CSV_TEMPLATE });
  }

  if (isFirstLoad) return <AnalyticsSkeleton />;

  return (
    <>
      <Header
        title="Analytics"
        subtitle="Sales insights"
        right={
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => setImportVisible(true)}
              className="bg-slate-100 rounded-xl px-3 py-1.5 flex-row items-center"
              style={{ gap: 4 }}
            >
              <Ionicons name="download-outline" size={15} color="#334155" />
              <ThemedText size="sm" weight="semibold" style={{ color: '#334155' }}>Import</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExportVisible(true)}
              className="bg-green-600 rounded-xl px-3 py-1.5 flex-row items-center"
              style={{ gap: 4 }}
            >
              <Ionicons name="share-outline" size={15} color="white" />
              <ThemedText size="sm" weight="semibold" style={{ color: '#fff' }}>Export</ThemedText>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <ThemedText size="base" weight="bold" className="mb-3">Key Stats</ThemedText>
        <View className="flex-row mb-3" style={{ gap: 12 }}>
          <StatCard label="Avg Sale" value={`₱${stats.avgSale.toFixed(2)}`} icon="cash-outline" />
          <StatCard label="Total Profit" value={`₱${stats.totalProfit.toFixed(2)}`} icon="trending-up-outline" />
        </View>
        <View className="flex-row mb-4" style={{ gap: 12 }}>
          <StatCard label="Peak Hour" value={stats.peakHour} icon="time-outline" />
          <StatCard label="Top Fruit" value={stats.topFruit} icon="trophy-outline" />
        </View>
        <RevenueChart transactions={transactions} fruits={fruits} />
        <WeeklyTrend transactions={transactions} />
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Export Modal */}
      <Modal visible={exportVisible} animationType="slide" transparent onRequestClose={() => setExportVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <View className="flex-row items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <ThemedText size="xl" weight="bold">Export Data</ThemedText>
              <TouchableOpacity onPress={() => setExportVisible(false)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Ionicons name="close" size={22} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={shareSummary}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 mb-3 flex-row items-center"
              style={{ gap: 14 }}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#e0f2fe' }}>
                <Ionicons name="document-text-outline" size={20} color="#0284c7" />
              </View>
              <View className="flex-1">
                <ThemedText size="base" weight="semibold" style={{ color: '#1e293b' }}>Share Summary</ThemedText>
                <ThemedText size="xs" style={{ color: '#64748b' }}>Daily report as plain text — share via any app</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={exportCSV}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 mb-3 flex-row items-center"
              style={{ gap: 14 }}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                <Ionicons name="grid-outline" size={20} color="#16a34a" />
              </View>
              <View className="flex-1">
                <ThemedText size="base" weight="semibold" style={{ color: '#1e293b' }}>Export as CSV</ThemedText>
                <ThemedText size="xs" style={{ color: '#64748b' }}>All transactions — open in Excel or Google Sheets</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>

            <View className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <ThemedText size="xs" style={{ color: '#92400e' }}>
                PDF and XLSX: Export as CSV, then open in Google Sheets or Microsoft Excel to save as PDF or XLSX.
              </ThemedText>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Import Guide Modal */}
      <Modal visible={importVisible} animationType="slide" transparent onRequestClose={() => setImportVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '90%' }}>
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <ThemedText size="xl" weight="bold">Import Guide</ThemedText>
              <TouchableOpacity onPress={() => setImportVisible(false)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Ionicons name="close" size={22} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Steps */}
              {[
                { num: '1', title: 'Download the template', body: 'Get the official CSV template with the correct column format.' },
                { num: '2', title: 'Fill in your data', body: 'Open the file in Google Sheets or Excel. Each row is one transaction: Date, Time, Fruit name, Quantity, Unit, Price per unit, Total.' },
                { num: '3', title: 'Save as CSV', body: 'In Google Sheets: File → Download → CSV. In Excel: File → Save As → CSV (Comma-delimited).' },
                { num: '4', title: 'Import the file', body: 'Full import is available in the web version. On this app you can share your data via Export → Export as CSV.' },
              ].map(step => (
                <View key={step.num} className="flex-row mb-4" style={{ gap: 14 }}>
                  <View
                    className="items-center justify-center rounded-full"
                    style={{ width: 32, height: 32, minWidth: 32, backgroundColor: '#16a34a' }}
                  >
                    <ThemedText size="sm" weight="bold" style={{ color: '#fff' }}>{step.num}</ThemedText>
                  </View>
                  <View className="flex-1">
                    <ThemedText size="sm" weight="semibold" style={{ color: '#1e293b', marginBottom: 2 }}>{step.title}</ThemedText>
                    <ThemedText size="xs" style={{ color: '#64748b', lineHeight: 18 }}>{step.body}</ThemedText>
                  </View>
                </View>
              ))}

              {/* Template preview */}
              <View className="bg-slate-900 rounded-xl px-4 py-3 mb-5">
                <ThemedText size="xs" weight="semibold" style={{ color: '#94a3b8', marginBottom: 6 }}>CSV Template Format</ThemedText>
                <ThemedText size="xs" style={{ color: '#4ade80', fontFamily: 'monospace', lineHeight: 18 }}>
                  Date,Time,Fruit,Qty,Unit,Price,Total{'\n'}
                  2026-05-16,09:30,Apple,2.5,kg,2.50,6.25{'\n'}
                  2026-05-16,10:00,Mango,1,kg,3.50,3.50
                </ThemedText>
              </View>

              <Button
                label="Download Template"
                onPress={downloadTemplate}
                fullWidth
              />

              <View className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <ThemedText size="xs" style={{ color: '#1e40af' }}>
                  Tip: The template is shared as a text file. Copy the content into a new spreadsheet and save as CSV.
                </ThemedText>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
