import { ActivityAction } from './activity-action';

export interface ActivityTemplateDB {
  id: string;
  name: string;
  description: string;
  duration: number;
  actions: ActivityAction[];
  color: string;
}
