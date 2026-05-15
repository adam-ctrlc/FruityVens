import './global.css';

import React, { useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainLayout } from '@/components/templates';
import {
  AddSaleModal, FruitDetailModal, RestockModal, EditFruitModal, CameraDetectModal,
} from '@/components/organisms';
import {
  DashboardScreen, InventoryScreen, HistoryScreen, AnalyticsScreen,
} from '@/screens';

import { fruits as seedFruits, transactions as seedTransactions, restockEvents as seedRestocks } from '@/data/mockData';
import { Screen, Fruit, Transaction, RestockEvent } from '@/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Screen>('dashboard');

  const [fruits, setFruits] = useState<Fruit[]>(seedFruits);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [restockEvents, setRestockEvents] = useState<RestockEvent[]>(seedRestocks);

  const [addSaleVisible, setAddSaleVisible] = useState(false);
  const [restockVisible, setRestockVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [detailFruit, setDetailFruit] = useState<Fruit | null>(null);
  const [editFruitTarget, setEditFruitTarget] = useState<Fruit | null>(null);
  const [pendingFruitForSale, setPendingFruitForSale] = useState<Fruit | null>(null);

  const lowStockCount = useMemo(() => fruits.filter(f => f.stock < 10).length, [fruits]);

  const handleAddSale = useCallback((fruitId: string, quantity: number) => {
    setFruits(prev => {
      const fruit = prev.find(f => f.id === fruitId);
      if (!fruit) return prev;
      const newTx: Transaction = {
        id: `t${Date.now()}`,
        fruitId: fruit.id,
        fruitName: fruit.name,
        quantity,
        unit: fruit.unit,
        total: parseFloat((fruit.price * quantity).toFixed(2)),
        timestamp: new Date(),
      };
      setTransactions(ts => [newTx, ...ts]);
      return prev.map(f =>
        f.id === fruitId ? { ...f, stock: parseFloat((f.stock - quantity).toFixed(2)) } : f,
      );
    });
    setAddSaleVisible(false);
    setPendingFruitForSale(null);
  }, []);

  const handleRestock = useCallback((fruitId: string, quantity: number, costPerUnit: number) => {
    setFruits(prev => {
      const fruit = prev.find(f => f.id === fruitId);
      if (!fruit) return prev;
      const totalCost = parseFloat((quantity * costPerUnit).toFixed(2));
      const newEvent: RestockEvent = {
        id: `r${Date.now()}`,
        fruitId: fruit.id,
        fruitName: fruit.name,
        quantity,
        unit: fruit.unit,
        costPerUnit,
        totalCost,
        timestamp: new Date(),
      };
      setRestockEvents(rs => [newEvent, ...rs]);
      return prev.map(f => {
        if (f.id !== fruitId) return f;
        const newStock = parseFloat((f.stock + quantity).toFixed(2));
        const newCostPrice = parseFloat(
          ((f.stock * f.costPrice + quantity * costPerUnit) / newStock).toFixed(2),
        );
        return { ...f, stock: newStock, costPrice: newCostPrice };
      });
    });
    setRestockVisible(false);
  }, []);

  const handleEditFruit = useCallback((fruitId: string, newPrice: number, newCostPrice: number) => {
    setFruits(prev =>
      prev.map(f => f.id === fruitId ? { ...f, price: newPrice, costPrice: newCostPrice } : f),
    );
    setEditFruitTarget(null);
  }, []);

  const openAddSale = useCallback(() => setAddSaleVisible(true), []);
  const openRestock = useCallback(() => setRestockVisible(true), []);
  const openCamera = useCallback(() => setCameraVisible(true), []);
  const closeCamera = useCallback(() => setCameraVisible(false), []);
  const handleCameraDetected = useCallback((fruit: Fruit) => {
    setCameraVisible(false);
    setPendingFruitForSale(fruit);
    setAddSaleVisible(true);
  }, []);
  const openDetail = useCallback((f: Fruit) => setDetailFruit(f), []);
  const openEdit = useCallback((f: Fruit) => setEditFruitTarget(f), []);
  const closeAddSale = useCallback(() => { setAddSaleVisible(false); setPendingFruitForSale(null); }, []);
  const closeRestock = useCallback(() => setRestockVisible(false), []);
  const closeDetail = useCallback(() => setDetailFruit(null), []);
  const closeEdit = useCallback(() => setEditFruitTarget(null), []);
  const openAddSaleFromDetail = useCallback((f: Fruit) => {
    setDetailFruit(null);
    setPendingFruitForSale(f);
    setAddSaleVisible(true);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            transactions={transactions}
            fruits={fruits}
            onAddSale={openAddSale}
          />
        );
      case 'inventory':
        return (
          <InventoryScreen
            fruits={fruits}
            onFruitPress={openDetail}
            onFruitEdit={openEdit}
            onAddSale={openAddSale}
            onRestock={openRestock}
            onScan={openCamera}
          />
        );
      case 'history':
        return <HistoryScreen transactions={transactions} fruits={fruits} />;
      case 'analytics':
        return <AnalyticsScreen transactions={transactions} fruits={fruits} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <MainLayout activeTab={activeTab} onTabPress={setActiveTab} lowStockCount={lowStockCount}>
        {renderScreen()}
      </MainLayout>

      <AddSaleModal
        visible={addSaleVisible}
        fruits={fruits}
        initialFruit={pendingFruitForSale}
        onConfirm={handleAddSale}
        onClose={closeAddSale}
      />

      <RestockModal
        visible={restockVisible}
        fruits={fruits}
        onConfirm={handleRestock}
        onClose={closeRestock}
      />

      <FruitDetailModal
        visible={detailFruit !== null}
        fruit={detailFruit}
        transactions={transactions}
        onClose={closeDetail}
        onAddSale={openAddSaleFromDetail}
      />

      <EditFruitModal
        visible={editFruitTarget !== null}
        fruit={editFruitTarget}
        onConfirm={handleEditFruit}
        onClose={closeEdit}
      />

      <CameraDetectModal
        visible={cameraVisible}
        fruits={fruits}
        onFruitDetected={handleCameraDetected}
        onClose={closeCamera}
      />
    </SafeAreaProvider>
  );
}
