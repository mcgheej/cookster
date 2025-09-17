import { computed, inject, Injectable, linkedSignal, signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/index';
import { DEFAULT_LANE_WIDTH, DEFAULT_PIXELS_PER_HOUR, DEFAULT_TIME_WINDOW } from '@util/app-config/index';
import { laneWidthPx, planKitchenResourcesEqual, ResourceLane, TimeWindow } from '@util/data-types/index';
import { LaneController, laneControllersEqual } from './types-constants/lane-control';

@Injectable()
export class PlanEditorDataService {
  private readonly plansData = inject(PlansDataService);

  /**
   * currentPlan
   * -----------
   * If a plan is being edited, the current plan, then the "currentPlan" signal will have a value of
   * type "Plan", otherwise it will be set to "null".
   *
   * activities
   * ----------
   * The "activities" signal is an array of type "ActivityDB[]". It will be an empty array if the
   * "currentPlan" value is "null", otherwise it will contain "ActivityDB" objects that have been defined
   * in the current plan.
   */
  readonly currentPlan = toSignal(this.plansData.currentPlan$, { initialValue: null });
  readonly activities = computed(() => this.currentPlan()?.activities || []);
  readonly kitchenResources = computed(
    () => {
      return this.currentPlan()?.properties.kitchenResources || [];
    },
    {
      equal: (a, b) => {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!planKitchenResourcesEqual(a[i], b[i])) {
            return false;
          }
        }
        return true;
      },
    }
  );

  /**
   * laneController
   * --------------
   */
  readonly laneController: WritableSignal<LaneController> = linkedSignal({
    source: () => ({ currentPlan: this.currentPlan }),
    equal: (a, b) => laneControllersEqual(a, b),
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
            laneWidth: DEFAULT_LANE_WIDTH,
          })),
        } as LaneController;
      }
      return prev.value;
    },
  });

  /**
   * resourceLanes
   * -------------
   */
  readonly resourceLanes = computed(() => {
    const laneControls = this.laneController().laneControls;
    const kitchenResources = this.kitchenResources();
    if (kitchenResources.length === 0) {
      return [];
    }
    return laneControls.map((lc, i) => {
      return {
        kitchenResource: kitchenResources[i],
        visible: lc.visible,
        laneWidth: lc.laneWidth,
      } as ResourceLane;
    });
  });

  /**
   * activitiesGridPixelsPerHour
   * ---------------------------
   */
  private readonly pixelsPerHour = signal<number>(DEFAULT_PIXELS_PER_HOUR);
  readonly activitiesGridPixelsPerHour = computed(() => this.pixelsPerHour());

  /**
   * activitiesGridWidth
   * -------------------
   */
  readonly activitiesGridWidth = computed(() => {
    const lanes = this.resourceLanes();
    return lanes.reduce((sum, lane) => {
      const width = lane.visible ? laneWidthPx[lane.laneWidth] : 0;
      return sum + width;
    }, 0);
  });

  /**
   * activitiesGridPlanEndTethered
   * -----------------------------
   */
  private readonly planEndTethered = signal<boolean>(true);
  readonly activitiesGridPlanEndTethered = computed(() => this.planEndTethered());

  /**
   * activitiesGridTimeWindow
   * ------------------------
   */
  private readonly timeWindow = signal<TimeWindow>(DEFAULT_TIME_WINDOW);
  readonly activitiesGridTimeWindow = computed(() => this.timeWindow());

  /**
   * scrollX and scrollY
   * -------------------
   */
  private readonly sX = signal<number>(0);
  private readonly sY = signal<number>(0);
  readonly scrollX = computed(() => this.sX());
  readonly scrollY = computed(() => this.sY());

  // Public methods
  // ==============

  /**
   * Set the number of pixels per hour for the activities grid. This controls the zoom level of the grid.
   *
   * @param value Number of pixels per hour to set for the activities grid
   */
  setActivitiesGridPixelsPerHour(value: number) {
    this.pixelsPerHour.set(value);
  }

  /**
   * Control whether the plan end is tethered to the plan activities and resource actions.
   *
   * @param value
   */
  setActivitiesGridPlanEndTethered(value: boolean) {
    this.planEndTethered.set(value);
  }

  /**
   *
   * @param value
   */
  setActivitiesGridTimeWindow(value: TimeWindow) {
    this.timeWindow.set(value);
  }

  /**
   *
   * @param value
   */
  setScrollX(value: number) {
    this.sX.set(value);
  }

  /**
   *
   * @param value
   */
  setScrollY(value: number) {
    this.sY.set(value);
  }
}
