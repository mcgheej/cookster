import { computed, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/index';
import { ACTIVITIES_GRID } from '@util/app-config/index';
import { ResourceLane, TimeWindow } from '@util/data-types/index';
import { LaneControl, LaneController } from './types-constants/lane-control';

@Injectable()
export class PlanEditorDataService {
  private readonly plansData = inject(PlansDataService);

  readonly currentPlan = toSignal(this.plansData.currentPlan$, { initialValue: null });
  readonly activities = computed(() => this.currentPlan()?.activities || []);

  readonly laneController: WritableSignal<LaneController> = linkedSignal({
    source: () => ({ currentPlan: this.currentPlan }),
    computation: ({ currentPlan }, prev) => {
      const plan = currentPlan();
      if (!plan) {
        return { flagsInitialised: false, laneControls: [] } as LaneController;
      }

      if (!prev || !prev.value.flagsInitialised) {
        const flags = plan.properties.kitchenResources.map(() => false);
        if (flags.length === 0) {
          return { flagsInitialised: false, laneControls: [] } as LaneController;
        }
        flags[0] = true; // Always show workspace lane (first lane)

        plan.activities.forEach((a) => {
          if (a.resourceIndex < flags.length) {
            flags[a.resourceIndex] = true;
          }
        });
        const flagsInitialised = plan.activities.length !== 0;
        return {
          flagsInitialised,
          laneControls: plan.properties.kitchenResources.map((kr, i) => ({
            visible: flags[i],
            name: kr.name,
            description: kr.description,
            tooltip: !kr.description || kr.name.toLowerCase() === kr.description.toLowerCase() ? '' : kr.description,
            laneWidth: 'narrow',
          })),
        } as LaneController;
      }
      return prev.value;
    },
  });

  readonly resourceLanes = computed(() => {
    const laneControls = this.laneController().laneControls;
    const plan = this.currentPlan();
    if (!plan) {
      return [];
    }
    return laneControls.map((lc, i) => {
      return {
        kitchenResource: plan.properties.kitchenResources[i],
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
