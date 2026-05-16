import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, FruitGrid } from '@/components/organisms';
import InventorySkeleton from '@/components/organisms/skeletons/InventorySkeleton';
import { ThemedText } from '@/components/atoms';
import { Fruit } from '@/types';
import { useFirstLoad } from '@/hooks/useFirstLoad';

interface InventoryScreenProps {
  fruits: Fruit[];
  onFruitPress: (fruit: Fruit) => void;
  onFruitEdit: (fruit: Fruit) => void;
  onAddSale: () => void;
  onRestock: () => void;
  onScan: () => void;
}

export default function InventoryScreen({
  fruits,
  onFruitPress,
  onFruitEdit,
  onAddSale,
  onRestock,
  onScan,
}: InventoryScreenProps) {
  const isFirstLoad = useFirstLoad(900);
  const criticalCount = fruits.filter(f => f.stock < 10).length;

  if (isFirstLoad) return <InventorySkeleton />;

  return (
    <>
      <Header
        title="Inventory"
        subtitle={`${fruits.length} items · ${criticalCount > 0 ? `${criticalCount} critical` : 'all stocked'}`}
      />

      {/* Fruit grid — extra bottom padding for FABs */}
      <View className="flex-1 px-4 pt-4" style={{ paddingBottom: 144 }}>
        <FruitGrid
          fruits={fruits}
          onFruitPress={onFruitPress}
          onFruitEdit={onFruitEdit}
        />
      </View>

      {/* Secondary FABs: Add Sale + Restock — positioned above the scan button */}
      <View
        style={{
          position: 'absolute',
          bottom: 92,
          right: 20,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        {/* Restock */}
        <TouchableOpacity
          onPress={onRestock}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#f59e0b',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
          }}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Restock inventory"
        >
          <Ionicons name="cube-outline" size={22} color="white" />
        </TouchableOpacity>

        {/* Add Sale manually */}
        <TouchableOpacity
          onPress={onAddSale}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#1e293b',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
          }}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Add sale manually"
        >
          <Ionicons name="add" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Primary Scan FAB — full-width pill at the bottom */}
      <TouchableOpacity
        onPress={onScan}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          height: 56,
          backgroundColor: '#16a34a',
          borderRadius: 28,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 5,
          gap: 10,
        }}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Scan fruit to add sale"
      >
        <Ionicons name="scan-outline" size={22} color="white" />
        <ThemedText size="base" weight="semibold" variant="inverse">Scan & Sell</ThemedText>
      </TouchableOpacity>
    </>
  );
}
