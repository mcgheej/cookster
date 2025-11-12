import { Plan } from './plan';

export interface ResourceAction {
  name: string;
  timeOffset: number;
}

export function resourceActionsEqual(a: ResourceAction, b: ResourceAction): boolean {
  return a.name === b.name && a.timeOffset === b.timeOffset;
}
