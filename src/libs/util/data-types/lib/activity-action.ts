import { ReferencePoint } from './reference-point';
import { ResourceAction } from './resource-action';
import { addMinutes, format, subMinutes } from 'date-fns';

export interface ActivityAction extends ResourceAction {
  referencePoint: ReferencePoint;
}

export function activityActionsEqual(a: ActivityAction, b: ActivityAction): boolean {
  return a.name === b.name && a.timeOffset === b.timeOffset && a.referencePoint === b.referencePoint;
}

export function activityActionTextTimed(
  action: ActivityAction,
  activityStartTimeOffset: number,
  activityDuration: number,
  planEnd: Date
): string {
  const activityStartTime = subMinutes(planEnd, activityStartTimeOffset);
  const activityEndTime = addMinutes(activityStartTime, activityDuration);
  const actionTime =
    action.referencePoint === 'start'
      ? addMinutes(activityStartTime, action.timeOffset)
      : subMinutes(activityEndTime, action.timeOffset);
  const actionTimeString = format(actionTime, 'HH:mm');
  return `${actionTimeString} - ${action.name}`;
}

export function activityActionText(action: ActivityAction): string {
  const durationMins = Math.abs(action.timeOffset);
  const direction =
    action.referencePoint === 'start'
      ? action.timeOffset >= 0
        ? 'after start'
        : 'before start'
      : action.timeOffset >= 0
        ? 'before end'
        : 'after end';
  return `${action.name} ${durationMins} minutes ${direction}`;
}
