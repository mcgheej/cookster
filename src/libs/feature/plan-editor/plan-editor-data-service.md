# Public API

```ts
readonly currentPlan: Signal<Plan | null>;
readonly activities: Signal<ActivityDB[]>;
readonly kitchenResources: Signal<PlanKitchenResource[]>;
readonly planColor: Signal<string>;
readonly laneController: WritableSignal<LaneController>;
readonly resourceLanes: Signal<ResourceLane[]>;
readonly selectedActivityId: Signal<string>;
readonly selectedActivity: Signal<ActivityDB | null>;
readonly activitiesGridPixelsPerHour: Signal<number>;
readonly activitiesGridWidth: Signal<number>;
readonly activitiesGridPlanEndTethered: Signal<boolean>;
readonly activitiesGridTimeWindow: Signal<TimeWindow>;
readonly scrollX: Signal<number>;
readonly scrollY: Signal<number>;

setActivitiesGridPixelsPerHour(value: number): void;
setActivitiesGridPlanEndTethered(value: boolean): void;
setActivitiesGridTimeWindow(value: TimeWindow): void;
setScrollX(value: number): void;
setScrollY(value: number): void;
setSelectedActivityId(activityId: string): void;
```
