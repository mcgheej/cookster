import { computed, Injectable, signal } from '@angular/core';
import { SelectorButton } from '@ui/multi-panel/index';
import {
  AlarmsPanel,
  KitchenPanel,
  SelectedActivityPanel,
  PlanPanel,
  TemplatesPanel,
} from '@ui/plan-editor-panels/index';
import { ACTIVITIES_GRID } from '@util/app-config/index';
import { TimeWindow } from '@util/data-types/index';

@Injectable()
export class PlanEditorDataService {
  readonly selectorButtons: SelectorButton[] = [
    {
      name: 'Plan',
      iconName: 'view_quilt',
      panelComponent: PlanPanel,
    },
    {
      name: 'Kitchen',
      iconName: 'kitchen',
      panelComponent: KitchenPanel,
    },
    {
      name: 'Templates',
      iconName: 'grid_goldenratio',
      panelComponent: TemplatesPanel,
    },
    {
      name: 'Alarms',
      iconName: 'alarm',
      panelComponent: AlarmsPanel,
    },
    {
      name: 'Activity',
      iconName: 'schedule',
      panelComponent: SelectedActivityPanel,
    },
  ] as const;

  private readonly pixelsPerHour = signal<number>(ACTIVITIES_GRID.pixelsPerHourDense);
  readonly activitiesGridPixelsPerHour = computed(() => this.pixelsPerHour());

  private readonly timeWindow = signal<TimeWindow>({
    start: 0,
    end: 24,
  });
  readonly activitiesGridTimeWindow = computed(() => this.timeWindow());

  setActivitiesGridPixelsPerHour(value: number) {
    this.pixelsPerHour.set(value);
  }

  setActivitiesGridTimeWindow(value: TimeWindow) {
    this.timeWindow.set(value);
  }
}
