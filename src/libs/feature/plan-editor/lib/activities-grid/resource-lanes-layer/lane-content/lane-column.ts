import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResourceLane } from '@util/data-types/lib/resource-lane';

@Component({
  selector: 'ck-lane-column',
  imports: [],
  templateUrl: './lane-column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaneColumn {
  readonly resourceLane = input.required<ResourceLane>();
}
