import React, { useState, useEffect } from 'react';
import {
  Modal, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Button, Input, FruitAvatar } from '@/components/atoms';
import { Fruit } from '@/types';

interface EditFruitModalProps {
  visible: boolean;
  fruit: Fruit | null;
  onConfirm: (fruitId: string, newPrice: number, newCostPrice: number) => void;
  onClose: () => void;
}

export default function EditFruitModal({ visible, fruit, onConfirm, onClose }: EditFruitModalProps) {
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');

  useEffect(() => {
    if (fruit && visible) {
      setPrice(fruit.price.toFixed(2));
      setCostPrice(fruit.costPrice.toFixed(2));
    }
  }, [fruit, visible]);

  const newPrice = parseFloat(price);
  const newCostPrice = parseFloat(costPrice);
  const canConfirm =
    !isNaN(newPrice) && newPrice > 0 &&
    !isNaN(newCostPrice) && newCostPrice >= 0 &&
    newCostPrice < newPrice;

  const margin = canConfirm ? Math.round(((newPrice - newCostPrice) / newPrice) * 100) : null;

  function handleConfirm() {
    if (!fruit || !canConfirm) return;
    onConfirm(fruit.id, newPrice, newCostPrice);
  }

  if (!fruit) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
          <View className="flex-row items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <ThemedText size="xl" weight="bold">Edit {fruit.name}</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Ionicons name="close" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-5">
            <FruitAvatar fruitId={fruit.id} size={72} />
          </View>

          <ThemedText size="sm" weight="medium" className="mb-1.5">Selling Price (₱ per {fruit.unit})</ThemedText>
          <Input
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="e.g. 2.50"
            className="mb-3"
          />

          <ThemedText size="sm" weight="medium" className="mb-1.5">Cost Price (₱ per {fruit.unit})</ThemedText>
          <Input
            value={costPrice}
            onChangeText={setCostPrice}
            keyboardType="decimal-pad"
            placeholder="e.g. 1.20"
            className="mb-3"
            error={!isNaN(newCostPrice) && !isNaN(newPrice) && newCostPrice >= newPrice}
          />
          {!isNaN(newCostPrice) && !isNaN(newPrice) && newCostPrice >= newPrice && (
            <ThemedText size="xs" variant="danger" className="mb-3">Cost price must be less than selling price</ThemedText>
          )}

          {margin !== null && (
            <View className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex-row items-center justify-between">
              <ThemedText size="sm" variant="muted">Profit Margin</ThemedText>
              <ThemedText size="base" weight="bold" variant="primary">{margin}%</ThemedText>
            </View>
          )}

          <Button label="Save Changes" onPress={handleConfirm} disabled={!canConfirm} fullWidth />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
