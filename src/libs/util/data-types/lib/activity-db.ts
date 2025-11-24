import { activityActionsEqual } from './activity-action';
import { ActivityTemplateDB } from './activity-template-db';

export interface ActivityEnvelope {
  startTimeOffset: number;
  duration: number;
}

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

export function dummyActivity(): ActivityDB {
  return {
    id: '',
    name: 'Dummy Activity',
    description: '',
    duration: 0,
    actions: [],
    color: 'basil',
    startMessage: '',
    endMessage: '',
    startTimeOffset: 0,
    planId: '',
    resourceIndex: 0,
  } as ActivityDB;
}

export function getActivityEnvelope(activity: ActivityDB): ActivityEnvelope {
  let s = activity.startTimeOffset;
  let e = activity.startTimeOffset - activity.duration;
  const startTimeOffset = activity.startTimeOffset;
  const endTimeOffset = startTimeOffset - activity.duration;
  if (activity.actions.length === 0) {
    return {
      startTimeOffset: s,
      duration: activity.duration,
    };
  }
  activity.actions.forEach((action) => {
    if (action.referencePoint === 'start') {
      const aOffset = startTimeOffset - action.timeOffset;
      if (aOffset > s) {
        s = aOffset;
      } else if (aOffset < e) {
        e = aOffset;
      }
    } else {
      const aOffset = endTimeOffset + action.timeOffset;
      if (aOffset > s) {
        s = aOffset;
      } else if (aOffset < e) {
        e = aOffset;
      }
    }
  });
  return {
    startTimeOffset: s,
    duration: s - e,
  };
}
