import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';

@Component({
  selector: 'ck-resource-action-icon',
  host: { class: 'grid grid-cols-[minmax(0,_1fr)]' },
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './resource-action-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceActionIcon {
  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
