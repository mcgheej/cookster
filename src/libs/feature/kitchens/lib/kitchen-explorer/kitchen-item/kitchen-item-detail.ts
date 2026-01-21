import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Kitchen } from '@util/data-types/index';

@Component({
  selector: 'ck-kitchen-item-detail',
  templateUrl: './kitchen-item-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenItemDetail {
  readonly kitchen = input.required<Kitchen>();

  protected maxParallelActivities(value: number): string {
    return value === 1 ? '1 activity at a time' : `${value} activities at a time`;
  }
}
