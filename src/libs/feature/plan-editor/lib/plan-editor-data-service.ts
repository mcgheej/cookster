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

  setActivitiesGridPixelsPerHour(value: number) {
    this.pixelsPerHour.set(value);
  }
}
