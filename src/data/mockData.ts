import { Fruit, Transaction, RestockEvent } from '@/types';

export const fruits: Fruit[] = [
  { id: '1', name: 'Apple',       price: 2.50, costPrice: 1.20, stock: 45.5, unit: 'kg' },
  { id: '2', name: 'Mango',       price: 3.80, costPrice: 2.00, stock: 22.0, unit: 'kg' },
  { id: '3', name: 'Banana',      price: 1.20, costPrice: 0.50, stock: 60.0, unit: 'kg' },
  { id: '4', name: 'Orange',      price: 2.10, costPrice: 0.90, stock: 38.5, unit: 'kg' },
  { id: '5', name: 'Grape',       price: 4.50, costPrice: 2.20, stock: 15.0, unit: 'kg' },
  { id: '6', name: 'Watermelon',  price: 1.80, costPrice: 0.80, stock:  8.0, unit: 'kg' },
  { id: '7', name: 'Pineapple',   price: 3.20, costPrice: 1.50, stock: 12.0, unit: 'kg' },
  { id: '8', name: 'Strawberry',  price: 5.00, costPrice: 2.50, stock: 10.5, unit: 'kg' },
];

export const transactions: Transaction[] = [
  { id: 't1', fruitId: '1', fruitName: 'Apple',      quantity: 3.5, unit: 'kg', total:  8.75, timestamp: new Date('2026-05-15T08:30:00') },
  { id: 't2', fruitId: '2', fruitName: 'Mango',      quantity: 2.0, unit: 'kg', total:  7.60, timestamp: new Date('2026-05-15T09:15:00') },
  { id: 't3', fruitId: '3', fruitName: 'Banana',     quantity: 5.0, unit: 'kg', total:  6.00, timestamp: new Date('2026-05-15T10:00:00') },
  { id: 't4', fruitId: '4', fruitName: 'Orange',     quantity: 4.0, unit: 'kg', total:  8.40, timestamp: new Date('2026-05-15T11:30:00') },
  { id: 't5', fruitId: '5', fruitName: 'Grape',      quantity: 1.5, unit: 'kg', total:  6.75, timestamp: new Date('2026-05-15T13:00:00') },
  { id: 't6', fruitId: '1', fruitName: 'Apple',      quantity: 2.0, unit: 'kg', total:  5.00, timestamp: new Date('2026-05-15T14:45:00') },
  { id: 't7', fruitId: '7', fruitName: 'Pineapple',  quantity: 1.0, unit: 'kg', total:  3.20, timestamp: new Date('2026-05-15T15:30:00') },
  { id: 't8', fruitId: '8', fruitName: 'Strawberry', quantity: 0.5, unit: 'kg', total:  2.50, timestamp: new Date('2026-05-15T16:00:00') },
];

export const restockEvents: RestockEvent[] = [
  { id: 'r1', fruitId: '1', fruitName: 'Apple',  quantity: 20, unit: 'kg', costPerUnit: 1.20, totalCost: 24.00, timestamp: new Date('2026-05-15T06:00:00') },
  { id: 'r2', fruitId: '3', fruitName: 'Banana', quantity: 30, unit: 'kg', costPerUnit: 0.50, totalCost: 15.00, timestamp: new Date('2026-05-15T06:30:00') },
  { id: 'r3', fruitId: '4', fruitName: 'Orange', quantity: 25, unit: 'kg', costPerUnit: 0.90, totalCost: 22.50, timestamp: new Date('2026-05-15T07:00:00') },
];
