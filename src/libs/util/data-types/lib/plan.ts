import { subMinutes } from 'date-fns';
import { ActivityDB } from './activity-db';
import { PlanProperties } from './plan-properties';
import { PlanSummary } from './plan-summary';
import { ResourceLane } from './resource-lane';

export class Plan {
  properties: PlanProperties;
  activities: ActivityDB[] = [];
  resourceLanes: ResourceLane[] = [];

  constructor(planSummary: PlanSummary, activities: ActivityDB[]) {
    const { dateTime, ...baseProperties } = planSummary;
    const durationMins = this.getDurationMins(planSummary, activities);
    const contentEndOffsetMins = this.getContentEndOffsetMins(planSummary, activities);
    this.properties = {
      ...baseProperties,
      startTime: subMinutes(dateTime, durationMins),
      endTime: dateTime,
      contentEnd: subMinutes(dateTime, contentEndOffsetMins),
      durationMins: durationMins,
    } as PlanProperties;
    this.activities = activities;
    this.resourceLanes = this.properties.kitchenResources.map((resource) => {
      const activities = this.activities.filter((activity) => activity.resourceIndex === resource.index);
      return {
        resource,
        visibility: activities.length > 0,
        laneWidth: 'narrow',
        activities,
      } as ResourceLane;
    });
  }

  /**
   *
   * @param plan
   * @param activities
   * @returns duration of plan in minutes
   *
   * When calculating the duration factor in resource actions and activity actions that start before
   * the activity (note activity actions cannot occur after the activity ends)
   */
  private getDurationMins(plan: PlanSummary, activities: ActivityDB[]): number {
    let duration = 0;
    plan.kitchenResources.forEach((kitchenResource) => {
      duration = kitchenResource.actions.reduce((d, action) => Math.max(d, action.timeOffset), duration);
    });
    activities.map((activity) => {
      duration = Math.max(duration, activity.startTimeOffset);
      duration = activity.actions.reduce((d, action) => {
        const timeOffsetToPlanEnd =
          action.referencePoint === 'start'
            ? activity.startTimeOffset - action.timeOffset
            : activity.startTimeOffset - activity.duration + action.timeOffset;
        return Math.max(d, timeOffsetToPlanEnd);
      }, duration);
    });
    return duration;
  }

  /**
   *
   * @param plan
   * @param activities
   * @returns offset in minutes from the plan end to the last activity end or resource action
   */
  private getContentEndOffsetMins(plan: PlanSummary, activities: ActivityDB[]): number {
    let contentEndOffset = 1440;
    plan.kitchenResources.forEach((resource) => {
      resource.actions.forEach((action) => {
        contentEndOffset = Math.min(contentEndOffset, action.timeOffset);
      });
    });
    activities.map((activity) => {
      contentEndOffset = Math.min(contentEndOffset, activity.startTimeOffset - activity.duration);
    });
    return contentEndOffset;
  }
}
