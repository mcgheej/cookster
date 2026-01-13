import { CookerSize } from './cooker-size';

export interface KitchenDB {
  id: string;
  name: string;
  hobSize: CookerSize;
  ovensSize: CookerSize;
}
