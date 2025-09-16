import { ReferencePoint } from './reference-point';
import { ResourceAction } from './resource-action';
import { addMinutes, format, subMinutes } from 'date-fns';

export class ActivityAction extends ResourceAction {
  constructor(
    name: string = '',
    timeOffset: number = 0,
    public referencePoint: ReferencePoint = 'start'
  ) {
    super(name, timeOffset);
  }

  text(): string {
    if (this.referencePoint === 'start') {
      if (this.timeOffset < 0) {
        return `${this.name} (${Math.abs(this.timeOffset)} min before start)`;
      } else {
        return `${this.name} (${this.timeOffset} min after start)`;
      }
    } else {
      if (this.timeOffset < 0) {
        return `${this.name} (${Math.abs(this.timeOffset)} min after end)`;
      } else {
        return `${this.name} (${this.timeOffset} min before end)`;
      }
    }
  }

  textTimed(activityStartTimeOffset: number, activityDuration: number, planEnd: Date): string {
    const activityStartTime = subMinutes(planEnd, activityStartTimeOffset);
    const activityEndTime = addMinutes(activityStartTime, activityDuration);
    const actionTime =
      this.referencePoint === 'start'
        ? addMinutes(activityStartTime, this.timeOffset)
        : subMinutes(activityEndTime, this.timeOffset);
    const actionTimeString = format(actionTime, 'HH:mm');
    return `${actionTimeString} - ${this.name}`;
  }
}

export function activityActionsEqual(a: ActivityAction, b: ActivityAction): boolean {
  return a.name === b.name && a.timeOffset === b.timeOffset && a.referencePoint === b.referencePoint;
}
