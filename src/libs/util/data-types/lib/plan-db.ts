import { Timestamp } from '@angular/fire/firestore';
import { PlanBase } from './plan-base';

export interface planDB extends PlanBase {
  date: Timestamp;
}
