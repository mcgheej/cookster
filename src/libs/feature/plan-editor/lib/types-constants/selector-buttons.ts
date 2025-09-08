import { SelectorButton } from '@ui/multi-panel/index';
import { AlarmsPanel, KitchenPanel, PlanPanel, SelectedActivityPanel, TemplatesPanel } from '../plan-editor-panels';

export const selectorButtons: SelectorButton[] = [
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
];
