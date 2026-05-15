import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, FruitGrid } from '@/components/organisms';
import InventorySkeleton from '@/components/organisms/skeletons/InventorySkeleton';
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
        subtitle={`${fruits.length} fruits · ${criticalCount > 0 ? `${criticalCount} critical` : 'all stocked'}`}
      />
      <View className="flex-1 px-4 pt-4" style={{ paddingBottom: 80 }}>
        <FruitGrid
          fruits={fruits}
          onFruitPress={onFruitPress}
          onFruitEdit={onFruitEdit}
        />
      </View>

      <TouchableOpacity
        onPress={onAddSale}
        className="bg-green-600 rounded-full items-center justify-center"
        style={{ position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, elevation: 4 }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onRestock}
        className="bg-amber-500 rounded-full items-center justify-center"
        style={{ position: 'absolute', bottom: 24, right: 92, width: 56, height: 56, elevation: 4 }}
        activeOpacity={0.8}
      >
        <Ionicons name="cube-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onScan}
        className="bg-blue-600 rounded-full items-center justify-center"
        style={{ position: 'absolute', bottom: 24, right: 160, width: 56, height: 56, elevation: 4 }}
        activeOpacity={0.8}
      >
        <Ionicons name="scan-outline" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}
