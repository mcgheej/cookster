import { ActivityTemplateDB } from './activity-template-db';

export interface ActivityDB extends ActivityTemplateDB {
  startTimeOffset: number;
  planId: string;
  resourceIndex: number;
}
