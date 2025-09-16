import { activityActionsEqual } from './activity-action';
import { ActivityTemplateDB } from './activity-template-db';

export interface ActivityDB extends ActivityTemplateDB {
  startTimeOffset: number;
  planId: string;
  resourceIndex: number;
}

export function activityDBsEqual(a: ActivityDB, b: ActivityDB): boolean {
  if (
    a.id !== b.id ||
    a.name !== b.name ||
    a.description !== b.description ||
    a.duration !== b.duration ||
    a.actions.length !== b.actions.length ||
    a.color !== b.color ||
    a.startMessage !== b.startMessage ||
    a.endMessage !== b.endMessage ||
    a.startTimeOffset !== b.startTimeOffset ||
    a.planId !== b.planId ||
    a.resourceIndex !== b.resourceIndex
  ) {
    return false;
  }
  for (let i = 0; i < a.actions.length; i++) {
    if (!activityActionsEqual(a.actions[i], b.actions[i])) {
      return false;
    }
  }
  return true;
}
