import { ActivityDB, Plan } from '@util/data-types/index';
import { Tiler } from './tiler';

export function exceedsMaxParallelActivities(
  newActivity: ActivityDB,
  activitiesInLane: ActivityDB[],
  plan: Plan
): boolean {
  const resource = plan.properties.kitchenResources[newActivity.resourceIndex];
  const tileActivities = [...activitiesInLane.filter((a) => a.id !== newActivity.id), ...[newActivity]];
  if (getMaxConurbationDepth(tileActivities, plan.properties.endTime) > resource.maxParallelActivities) {
    return true;
  }
  return false;
}

function getMaxConurbationDepth(activitiesInLane: ActivityDB[], planEnd: Date): number {
  const tempTiler = new Tiler();
  tempTiler.buildConurbations(activitiesInLane, planEnd);
  const maxDepth = tempTiler.conurbations.reduce(
    (maxDepth, conurbation) => (maxDepth >= conurbation.maxDepth ? maxDepth : conurbation.maxDepth),
    0
  );
  return maxDepth;
}
