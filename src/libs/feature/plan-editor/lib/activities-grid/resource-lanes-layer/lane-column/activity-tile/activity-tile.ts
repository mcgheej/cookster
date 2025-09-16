import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DisplayTile } from '@util/data-types/index';

@Component({
  selector: 'ck-activity-tile',
  imports: [NgStyle, MatIconModule],
  templateUrl: './activity-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTile {
  tile = input.required<DisplayTile>();
}
