import { CookerSize } from './cooker-size';
import { KitchenResourceDB } from './kitchen-resource-db';

export interface Kitchen {
  id: string;
  name: string;
  hobSize: CookerSize;
  ovensSize: CookerSize;
  resources: Map<string, KitchenResourceDB>;
  resourcesArray: KitchenResourceDB[];
}
