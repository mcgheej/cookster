import { SelectorButton } from '@ui/multi-panel/index';
import { AlarmsPanel, KitchenPanel, PlanPanel, SelectedActivityPanel, TemplatesPanel } from '../plan-editor-panels';

export const PLAN_PANEL_NAME = 'Plan';
export const KITCHEN_PANEL_NAME = 'Kitchen';
export const TEMPLATES_PANEL_NAME = 'Templates';
export const ALARMS_PANEL_NAME = 'Alarms';
export const SELECTED_ACTIVITY_PANEL_NAME = 'Activity';

export const selectorButtons: SelectorButton[] = [
  {
    name: PLAN_PANEL_NAME,
    iconName: 'view_quilt',
    panelComponent: PlanPanel,
  },
  {
    name: KITCHEN_PANEL_NAME,
    iconName: 'kitchen',
    panelComponent: KitchenPanel,
  },
  {
    name: TEMPLATES_PANEL_NAME,
    iconName: 'grid_goldenratio',
    panelComponent: TemplatesPanel,
  },
  {
    name: ALARMS_PANEL_NAME,
    iconName: 'alarm',
    panelComponent: AlarmsPanel,
  },
  {
    name: SELECTED_ACTIVITY_PANEL_NAME,
    iconName: 'schedule',
    panelComponent: SelectedActivityPanel,
  },
];
