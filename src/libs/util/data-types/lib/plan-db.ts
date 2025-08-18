import { Timestamp } from '@angular/fire/firestore';
import { PlanBase } from './plan-base';

export interface PlanDB extends PlanBase {
  date: Timestamp;
}
