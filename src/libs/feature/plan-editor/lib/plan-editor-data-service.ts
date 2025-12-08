import { computed, inject, Injectable, linkedSignal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/index';
import {
  DEFAULT_LANE_WIDTH,
  DEFAULT_PIXELS_PER_HOUR,
  DEFAULT_PLAN_COLOR,
  DEFAULT_TIME_SNAP_MINS,
  googleColors,
} from '@util/app-config/index';
import {
  ActivityDB,
  FULL_TIME_WINDOW,
  laneWidthPx,
  planKitchenResourcesEqual,
  ResourceLane,
} from '@util/data-types/index';
import { LaneController, laneControllersEqual } from './types-constants/lane-control';
import { ActivitiesDataService } from '@data-access/plans/lib/activities-data';
import { isSameMinute } from 'date-fns';
import { TemplatesDataService } from '@data-access/templates/index';

@Injectable()
export class PlanEditorDataService {
  private readonly plansData = inject(PlansDataService);
  private readonly activitiesData = inject(ActivitiesDataService);
  private readonly activityTemplatesData = inject(TemplatesDataService);

  private readonly activitiesMap = toSignal(this.activitiesData.activitiesMap$, {
    initialValue: new Map<string, ActivityDB>(),
  });

  readonly activityTemplates = toSignal(this.activityTemplatesData.templates$, { initialValue: [] });

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
   *
   * kitchenResources
   * --------------------
   * The "kitchenResources" signal is an array of type "KitchenResource[]". It will be an empty array if the
   * "currentPlan" value is "null", otherwise it will contain "KitchenResource" objects that have been defined
   * in the current plan.
   *
   * planColor
   * ---------
   * The "planColor" signal is a string representing the colour of the current plan. If there is no current plan,
   * it defaults to a predefined colour. The result is a hex colour string.
   */
  // readonly currentPlan = toSignal(this.plansData.currentPlan$, { initialValue: null });
  readonly currentPlan = this.plansData.currentPlan;
  readonly activities = computed(() => this.currentPlan()?.activities || []);
  readonly alarmGroups = this.plansData.currentAlarms;
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
  readonly planColor = computed(() => {
    const plan = this.currentPlan();
    return plan ? googleColors[plan.properties.color].color : googleColors[DEFAULT_PLAN_COLOR].color;
  });
  readonly planEndTime = computed(
    () => {
      return this.currentPlan()?.properties.endTime || new Date(0);
    },
    { equal: (a, b) => isSameMinute(a, b) }
  );
  readonly planTimeWindow = computed(
    () => {
      return this.currentPlan()?.properties.timeWindow || FULL_TIME_WINDOW;
    },
    { equal: (a, b) => a.startHours === b.startHours && a.endHours === b.endHours }
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
   * selectedActivityId
   * ------------------
   */
  private _selectedActivityId = signal<string>('');
  readonly selectedActivityId = computed(() => this._selectedActivityId());

  /**
   * selectedActivity
   * ----------------
   */
  readonly selectedActivity = computed(() => {
    const activityId = this._selectedActivityId();
    const activitiesMap = this.activitiesMap();
    return activitiesMap.get(activityId) || null;
  });

  /**
   * timeSnapMins
   * --------------
   */
  private readonly _timeSnapMins = signal<number>(DEFAULT_TIME_SNAP_MINS);
  readonly timeSnapMins = computed(() => this._timeSnapMins());

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
   * Activities Grid scrollX and scrollY
   * -----------------------------------
   */
  private readonly sX = signal<number>(0);
  private readonly sY = signal<number>(0);
  readonly activitiesGridScrollX = computed(() => this.sX());
  readonly activitiesGridScrollY = computed(() => this.sY());

  /**
   * Activities Grid Rectangle
   * -------------------------
   */
  private readonly gridBoundingRect = signal<DOMRect>(DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 }));
  readonly activitiesGridBoundingRect = computed(() => this.gridBoundingRect());
  private readonly gridRect = signal<DOMRect>(DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 }));
  readonly activitiesGridRect = computed(() => this.gridRect());

  // Public methods
  // ==============

  /**
   * Set the time snap minutes for the plan editor. This controls the granularity of time-based drags when
   * snap enabled by holding down shift key.
   */
  setTimeSnapMins(newTimeSnapMins: number) {
    this._timeSnapMins.set(newTimeSnapMins);
  }

  /**
   * Set the number of pixels per hour for the activities grid. This controls the zoom level of the grid.
   *
   * @param newPixelsPerHour Number of pixels per hour to set for the activities grid
   */
  setActivitiesGridPixelsPerHour(newPixelsPerHour: number) {
    this.pixelsPerHour.set(newPixelsPerHour);
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
   * @param newScrollX
   */
  setScrollX(newScrollX: number) {
    this.sX.set(newScrollX);
  }

  /**
   *
   * @param newScrollY
   */
  setScrollY(newScrollY: number) {
    this.sY.set(newScrollY);
  }

  /**
   *
   * @param newRect
   */
  setActivitiesGridRect(newRect: DOMRect) {
    this.gridRect.set(newRect);
  }

  /**
   *
   * @param newRect
   */
  setActivitiesGridBoundingRect(newRect: DOMRect) {
    this.gridBoundingRect.set(newRect);
  }

  /**
   *
   * @param activityId
   */
  setSelectedActivityId(activityId: string) {
    this._selectedActivityId.set(activityId);
  }
}
