export interface Fruit {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  unit: string;
}

export interface Transaction {
  id: string;
  fruitId: string;
  fruitName: string;
  quantity: number;
  unit: string;
  total: number;
  timestamp: Date;
}

export interface RestockEvent {
  id: string;
  fruitId: string;
  fruitName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  timestamp: Date;
}

export interface FruitStat {
  fruitId: string;
  fruitName: string;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalQuantity: number;
  transactionCount: number;
}

export interface DaySection {
  title: string;
  displayDate: string;
  dailyRevenue: number;
  dailyProfit: number;
  data: Transaction[];
}

export type Screen = 'scan' | 'inventory' | 'history' | 'analytics';
export type HistoryFilter = 'today' | 'week' | 'all';

export type { FruitDetection, FruitDetectionResult, FruitDetectionError } from './detection';
