import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Button, Input, FruitAvatar } from '@/components/atoms';
import { Fruit } from '@/types';

interface RestockModalProps {
  visible: boolean;
  fruits: Fruit[];
  onConfirm: (fruitId: string, quantity: number, costPerUnit: number) => void;
  onClose: () => void;
}

export default function RestockModal({ visible, fruits, onConfirm, onClose }: RestockModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const [quantity, setQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');

  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedFruit(null);
      setQuantity('');
      setCostPerUnit('');
    }
  }, [visible]);

  const totalCost = useMemo(() => {
    const q = parseFloat(quantity);
    const c = parseFloat(costPerUnit);
    if (isNaN(q) || q <= 0 || isNaN(c) || c < 0) return null;
    return (q * c).toFixed(2);
  }, [quantity, costPerUnit]);

  const canConfirm = totalCost !== null && parseFloat(quantity) > 0 && parseFloat(costPerUnit) >= 0;

  function handleConfirm() {
    if (!selectedFruit || !canConfirm) return;
    onConfirm(selectedFruit.id, parseFloat(quantity), parseFloat(costPerUnit));
    setStep(1);
    setSelectedFruit(null);
    setQuantity('');
    setCostPerUnit('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '85%' }}>
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <ThemedText size="xl" weight="bold">
              {step === 1 ? 'Restock Fruit' : `Restock ${selectedFruit?.name}`}
            </ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Ionicons name="close" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {step === 1 ? (
            <ScrollView className="px-4 pt-3" showsVerticalScrollIndicator={false}>
              {fruits.map(fruit => (
                <TouchableOpacity
                  key={fruit.id}
                  onPress={() => {
                    setSelectedFruit(fruit);
                    setCostPerUnit(fruit.costPrice.toFixed(2));
                    setStep(2);
                  }}
                  className="flex-row items-center py-3.5 border-b border-slate-50"
                  activeOpacity={0.7}
                >
                  <View style={{ width: 44 }}>
                    <FruitAvatar fruitId={fruit.id} size={36} />
                  </View>
                  <View className="flex-1">
                    <ThemedText size="sm" weight="semibold">{fruit.name}</ThemedText>
                    <ThemedText size="xs" variant="muted">Current: {fruit.stock} {fruit.unit}</ThemedText>
                  </View>
                  <ThemedText size="xs" variant="muted">Cost: ₱{fruit.costPrice}/{fruit.unit}</ThemedText>
                </TouchableOpacity>
              ))}
              <View style={{ height: 32 }} />
            </ScrollView>
          ) : (
            <View className="px-5 pt-4 pb-8">
              <View className="items-center mb-6">
                {selectedFruit && <FruitAvatar fruitId={selectedFruit.id} size={64} />}
                <ThemedText size="lg" weight="bold" className="mt-3">{selectedFruit?.name}</ThemedText>
                <ThemedText size="sm" variant="muted">Current stock: {selectedFruit?.stock} {selectedFruit?.unit}</ThemedText>
              </View>

              <ThemedText size="sm" weight="medium" className="mb-1.5">Quantity to add ({selectedFruit?.unit})</ThemedText>
              <Input
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                placeholder="e.g. 20"
                className="mb-3"
              />

              <ThemedText size="sm" weight="medium" className="mb-1.5">
                Cost per {selectedFruit?.unit} (₱)
              </ThemedText>
              <Input
                value={costPerUnit}
                onChangeText={setCostPerUnit}
                keyboardType="decimal-pad"
                placeholder="e.g. 1.20"
                className="mb-3"
              />

              {totalCost && (
                <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 items-center">
                  <ThemedText size="sm" variant="muted">Total Cost</ThemedText>
                  <ThemedText size="3xl" weight="bold">₱{totalCost}</ThemedText>
                </View>
              )}

              <View className="flex-row" style={{ gap: 12 }}>
                <View className="flex-1">
                  <Button label="Back" variant="outline" onPress={() => setStep(1)} />
                </View>
                <View className="flex-1">
                  <Button label="Confirm Restock" onPress={handleConfirm} disabled={!canConfirm} />
                </View>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
