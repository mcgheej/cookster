import { subMinutes } from 'date-fns';
import { ActivityDB } from './activity-db';
import { PlanProperties } from './plan-properties';
import { PlanSummary } from './plan-summary';

export interface Plan {
  properties: PlanProperties;
  activities: ActivityDB[];
}

export function createPlanFactory(planSummary: PlanSummary, activities: ActivityDB[]): Plan {
  const { dateTime, ...baseProperties } = planSummary;
  const durationMins = getDurationMins(planSummary, activities);
  const contentEndOffsetMins = getContentEndOffsetMins(planSummary, activities);
  return {
    properties: {
      ...baseProperties,
      startTime: subMinutes(dateTime, durationMins),
      endTime: dateTime,
      contentEnd: subMinutes(dateTime, contentEndOffsetMins),
      durationMins: durationMins,
    } as PlanProperties,
    activities: activities,
  };
}

export function dummyPlan(): Plan {
  const now = new Date();
  return {
    properties: {
      id: '',
      name: 'Dummy Plan',
      description: '',
      color: 'basil',
      kitchenName: 'My Kitchen',
      kitchenResources: [],
      startTime: now,
      endTime: now,
      contentEnd: now,
      durationMins: 0,
    } as PlanProperties,
    activities: [],
  };
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

function getDurationMins(plan: PlanSummary, activities: ActivityDB[]): number {
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
function getContentEndOffsetMins(plan: PlanSummary, activities: ActivityDB[]): number {
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
