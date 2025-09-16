import { ResourceAction } from './resource-action';

export interface ActionDisplayTile {
  index: number;
  resourceAction: ResourceAction;
  xPx: number;
  yPx: number;
  time: string;
}
