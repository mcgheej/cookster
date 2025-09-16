import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { DisplayTile } from '@util/data-types/index';

@Component({
  selector: 'ck-activity-tile',
  imports: [NgStyle, MatIconModule, MatTooltipModule],
  templateUrl: './activity-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTile {
  tile = input.required<DisplayTile>();

  protected startEndTimes = computed(() => {
    const startTime = this.timeFromMidnightToString(this.tile().startMinsFromMidnight);
    const endTime = this.timeFromMidnightToString(this.tile().endMinsFromMidnight);
    return this.tile().activity.name + ': ' + startTime + ' - ' + endTime;
  });

  protected readonly showDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  private timeFromMidnightToString(minsFromMidnight: number): string {
    const hours = Math.floor(minsFromMidnight / 60);
    const minutes = minsFromMidnight % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
