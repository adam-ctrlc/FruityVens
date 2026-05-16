import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, Button, Input, FruitAvatar } from '@/components/atoms';
import { Fruit } from '@/types';

interface AddSaleModalProps {
  visible: boolean;
  fruits: Fruit[];
  initialFruit?: Fruit | null;
  onConfirm: (fruitId: string, quantity: number) => void;
  onClose: () => void;
}

export default function AddSaleModal({ visible, fruits, initialFruit, onConfirm, onClose }: AddSaleModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (visible) {
      if (initialFruit) {
        setSelectedFruit(initialFruit);
        setStep(2);
      } else {
        setStep(1);
        setSelectedFruit(null);
      }
      setQuantity('');
    }
  }, [visible, initialFruit]);

  const total = useMemo(() => {
    const q = parseFloat(quantity);
    if (!selectedFruit || isNaN(q) || q <= 0) return null;
    return (selectedFruit.price * q).toFixed(2);
  }, [selectedFruit, quantity]);

  const canConfirm = total !== null && parseFloat(quantity) <= (selectedFruit?.stock ?? 0);

  function handleConfirm() {
    if (!selectedFruit || !canConfirm) return;
    onConfirm(selectedFruit.id, parseFloat(quantity));
    setStep(1);
    setSelectedFruit(null);
    setQuantity('');
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
              {step === 1 ? 'Select Fruit' : `Sell ${selectedFruit?.name}`}
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
                  onPress={() => { setSelectedFruit(fruit); setStep(2); }}
                  className="flex-row items-center py-3.5 border-b border-slate-50"
                  activeOpacity={0.7}
                >
                  <View style={{ width: 44 }}>
                    <FruitAvatar fruitId={fruit.id} size={36} />
                  </View>
                  <View className="flex-1">
                    <ThemedText size="sm" weight="semibold">{fruit.name}</ThemedText>
                    <ThemedText size="xs" variant="muted">{fruit.stock} {fruit.unit} available</ThemedText>
                  </View>
                  <ThemedText size="sm" weight="bold" variant="primary">
                    ₱{fruit.price.toFixed(2)}/{fruit.unit}
                  </ThemedText>
                </TouchableOpacity>
              ))}
              <View style={{ height: 32 }} />
            </ScrollView>
          ) : (
            <View className="px-5 pt-4 pb-8">
              <View className="items-center mb-6">
                {selectedFruit && <FruitAvatar fruitId={selectedFruit.id} size={64} />}
                <ThemedText size="lg" weight="bold" className="mt-3">{selectedFruit?.name}</ThemedText>
                <ThemedText size="sm" variant="muted">
                  ₱{selectedFruit?.price.toFixed(2)}/{selectedFruit?.unit} · {selectedFruit?.stock} {selectedFruit?.unit} available
                </ThemedText>
              </View>
              <ThemedText size="sm" weight="medium" className="mb-1.5">
                Quantity ({selectedFruit?.unit})
              </ThemedText>
              <Input
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                placeholder={`Enter weight in ${selectedFruit?.unit}`}
                className="mb-3"
              />
              {total && (
                <View className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-5 items-center">
                  <ThemedText size="sm" variant="muted">Total</ThemedText>
                  <ThemedText size="3xl" weight="bold" variant="primary">₱{total}</ThemedText>
                  {parseFloat(quantity) > (selectedFruit?.stock ?? 0) && (
                    <ThemedText size="xs" variant="danger" className="mt-1">Exceeds available stock</ThemedText>
                  )}
                </View>
              )}
              <View className="flex-row" style={{ gap: 12 }}>
                <View className="flex-1">
                  <Button label="Back" variant="outline" onPress={() => setStep(1)} />
                </View>
                <View className="flex-1">
                  <Button label="Confirm Sale" onPress={handleConfirm} disabled={!canConfirm} />
                </View>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
