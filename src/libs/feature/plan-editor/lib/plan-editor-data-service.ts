import { computed, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/index';
import { ACTIVITIES_GRID } from '@util/app-config/index';
import { ResourceLane, TimeWindow } from '@util/data-types/index';
import { LaneControl } from './types-constants/lane-control';

@Injectable()
export class PlanEditorDataService {
  private readonly plansData = inject(PlansDataService);

  readonly currentPlan = toSignal(this.plansData.currentPlan$, { initialValue: null });
  readonly activities = computed(() => this.currentPlan()?.activities || []);

  readonly laneControls: WritableSignal<LaneControl[]> = linkedSignal({
    source: () => ({ currentPlan: this.currentPlan }),
    computation: ({ currentPlan }, prev) => {
      console.log('1', currentPlan());
      const plan = currentPlan();
      if (!plan) {
        console.log('2 - no plan so return empty array');
        return [] as LaneControl[];
      }
      // If prev is undefined or prev.value is [] then this must be first time through so use plan properties to
      // initialise the array
      if (!prev || (prev.value && prev.value.length === 0)) {
        const flags = plan.properties.kitchenResources.map(() => false);
        if (flags.length === 0) {
          return [] as LaneControl[];
        }
        flags[0] = true; // Always show workspace lane (first lane)
        plan.activities.forEach((a) => {
          if (a.resourceIndex < flags.length) {
            flags[a.resourceIndex] = true;
          }
        });
        console.log('3 - first time so create from plan properties', flags, plan.activities);
        return plan.properties.kitchenResources.map((kr, i) => ({
          visible: flags[i],
          name: kr.name,
          tooltip: !kr.description || kr.name.toLowerCase() === kr.description.toLowerCase() ? '' : kr.description,
          laneWidth: 'narrow',
        })) as LaneControl[];
      }
      console.log('4 - just return previous value', prev.value);
      return prev.value;
    },
  });

  readonly resourceLanes = computed(() => {
    const laneControls = this.laneControls();
    const plan = this.currentPlan();
    if (!plan) {
      return [];
    }
    return laneControls.map((lc, i) => {
      return {
        resourceIndex: i,
        visible: lc.visible,
        laneWidth: lc.laneWidth,
      } as ResourceLane;
    });
  });

  /** pixelsPerHour */
  private readonly pixelsPerHour = signal<number>(ACTIVITIES_GRID.pixelsPerHourCompressed);
  readonly activitiesGridPixelsPerHour = computed(() => this.pixelsPerHour());

  /** planEndTethered */
  private readonly planEndTethered = signal<boolean>(true);
  readonly activitiesGridPlanEndTethered = computed(() => this.planEndTethered());

  /** timeWindow */
  private readonly timeWindow = signal<TimeWindow>({
    start: 0,
    end: 24,
  });
  readonly activitiesGridTimeWindow = computed(() => this.timeWindow());

  setActivitiesGridPixelsPerHour(value: number) {
    this.pixelsPerHour.set(value);
  }

  setActivitiesGridPlanEndTethered(value: boolean) {
    this.planEndTethered.set(value);
  }

  setActivitiesGridTimeWindow(value: TimeWindow) {
    this.timeWindow.set(value);
  }
}
