import { KitchenResourceDB } from './kitchen-resource-db';

export interface Kitchen {
  id: string;
  name: string;
  resources: Map<string, KitchenResourceDB>;
  resourcesArray: KitchenResourceDB[];
}
