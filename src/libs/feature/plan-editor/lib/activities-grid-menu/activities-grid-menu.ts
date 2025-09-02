import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ACTIVITIES_GRID_HEADER_HEIGHT, DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { PlanEditorDataService } from '../plan-editor-data-service';

@Component({
  selector: 'ck-activities-grid-menu',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './activities-grid-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGridMenu {
  private readonly editorData = inject(PlanEditorDataService);

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
  protected readonly headerHeight = `h-[${ACTIVITIES_GRID_HEADER_HEIGHT}px]` as const;

  protected readonly gridMenuData = computed(() => {
    return {
      pixelsPerHour: this.editorData.activitiesGridPixelsPerHour(),
    };
  });

  setPixelsPerHour(pixelsPerHour: number) {
    if (pixelsPerHour !== this.editorData.activitiesGridPixelsPerHour()) {
      this.editorData.setActivitiesGridPixelsPerHour(pixelsPerHour);
    }
  }
}
