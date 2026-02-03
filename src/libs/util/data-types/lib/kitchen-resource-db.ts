import { Kitchen } from './kitchen';

export interface KitchenResourceDB {
  id: string;
  kitchenId: string;
  name: string;
  description: string;
  maxParallelActivities: number;
  seq: number;
}

export function kitchenResourceDBsDifferent(a: KitchenResourceDB, b: KitchenResourceDB): boolean {
  return (
    a.id !== b.id ||
    a.kitchenId !== b.kitchenId ||
    a.name !== b.name ||
    a.description !== b.description ||
    a.maxParallelActivities !== b.maxParallelActivities ||
    a.seq !== b.seq
  );
}

export function kitchenResourceDBsEqual(a: KitchenResourceDB, b: KitchenResourceDB): boolean {
  return !kitchenResourceDBsDifferent(a, b);
}
