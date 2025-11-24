import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ResourceLane } from '@util/data-types/index';
import { ActivityTilesService } from './activity-tiles-service';
import { ActivityTile } from './activity-tile/activity-tile';

@Component({
  selector: 'ck-activity-tiles',
  imports: [ActivityTile],
  template: `
    @for (tile of activityTiles(); track $index) {
      <ck-activity-tile [tile]="tile" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivityTilesService],
})
export class ActivityTiles {
  private readonly service = inject(ActivityTilesService);
  readonly resourceLane = input.required<ResourceLane>();

  protected readonly resourceActivties = this.service.computedResourceActivities(this.resourceLane);
  protected readonly activityTiles = this.service.computedActivityTiles(this.resourceLane, this.resourceActivties);
}
