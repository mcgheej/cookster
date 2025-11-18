import { ReferencePoint } from './reference-point';
import { ResourceAction } from './resource-action';
import { addHours, addMinutes, format, getHours, isAfter, isBefore, startOfDay, subMinutes } from 'date-fns';
import { TimeWindow } from './time-window';

export interface ActivityAction extends ResourceAction {
  referencePoint: ReferencePoint;
}

export function activityActionsEqual(a: ActivityAction, b: ActivityAction): boolean {
  return a.name === b.name && a.timeOffset === b.timeOffset && a.referencePoint === b.referencePoint;
}

export function activityActionAfterPlanEnd(
  action: ActivityAction,
  activityStartTimeOffset: number,
  activityDuration: number,
  planEnd: Date
): boolean {
  const actionTime = activityActionTime(action, activityStartTimeOffset, activityDuration, planEnd);
  return isAfter(actionTime, planEnd);
}

export function activityActionOutsideTimeWindow(
  action: ActivityAction,
  activityStartTimeOffset: number,
  activityDuration: number,
  planEnd: Date,
  planTimeWindow: TimeWindow
): boolean {
  const actionTimeHours = getHours(activityActionTime(action, activityStartTimeOffset, activityDuration, planEnd));
  return actionTimeHours < planTimeWindow.startHours || actionTimeHours > planTimeWindow.endHours;
}

export function activityActionOutsideValidTimePeriod(
  action: ActivityAction,
  activityStartTimeOffset: number,
  activityDuration: number,
  planEnd: Date,
  planTimeWindow: TimeWindow
): boolean {
  const actionTime = activityActionTime(action, activityStartTimeOffset, activityDuration, planEnd);
  const startTimeWindow = addHours(startOfDay(planEnd), planTimeWindow.startHours);
  return isAfter(actionTime, planEnd) || isBefore(actionTime, startTimeWindow);
}

export function activityActionTime(
  action: ActivityAction,
  activityStartTimeOffset: number,
  activityDuration: number,
  planEnd: Date
): Date {
  const activityStartTime = subMinutes(planEnd, activityStartTimeOffset);
  const activityEndTime = addMinutes(activityStartTime, activityDuration);
  return action.referencePoint === 'start'
    ? addMinutes(activityStartTime, action.timeOffset)
    : subMinutes(activityEndTime, action.timeOffset);
}

export function activityActionTextTimed(
  action: ActivityAction,
  activityStartTimeOffset: number,
  activityDuration: number,
  planEnd: Date
): string {
  const actionTimeString = format(
    activityActionTime(action, activityStartTimeOffset, activityDuration, planEnd),
    'HH:mm'
  );
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
