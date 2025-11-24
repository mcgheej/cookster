import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import { CkDrag, DragChangeActivityDuration, DragResult } from '@ui/drag-and-drop/index';
import { googleColors } from '@util/app-config/index';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { DisplayTile } from '@util/data-types/index';

@Component({
  selector: 'ck-activity-tile',
  host: {
    '[style.visibility]': 'showElement()',
  },
  imports: [NgStyle, MatIconModule, MatTooltipModule, CkDrag],
  templateUrl: './activity-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTile {
  private planEditorData = inject(PlanEditorDataService);

  tile = input.required<DisplayTile>();

  protected readonly selectedActivityId = this.planEditorData.selectedActivityId;

  protected readonly dragOperation = computed(() => {
    return new DragChangeActivityDuration({
      id: 'drag-change-activity-duration',
      lockAxis: 'y',
      plan: this.planEditorData.currentPlan(),
      displayTile: this.tile(),
    });
  });

  protected startEndTimes = computed(() => {
    const startTime = this.timeFromMidnightToString(this.tile().startMinsFromMidnight);
    const endTime = this.timeFromMidnightToString(this.tile().endMinsFromMidnight);
    return this.tile().activity.name + ': ' + startTime + ' - ' + endTime;
  });

  protected showElement = signal<'visible' | 'hidden'>('visible');

  protected readonly showDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected activityClicked(ev: MouseEvent) {
    ev.stopPropagation();
    if (this.tile().activity.id === this.selectedActivityId()) {
      this.planEditorData.setSelectedActivityId('');
    } else {
      this.planEditorData.setSelectedActivityId(this.tile().activity.id);
    }
  }

  protected onDragDurationStart() {
    this.showElement.set('hidden');
  }

  protected onDragDurationEnd(ev: DragResult | undefined) {
    console.log('ActivityTile.onDragDurationEnd ev:', ev);
    this.showElement.set('visible');
  }

  protected getResizeHandleStyles() {
    const tile = this.tile();
    return {
      top: `${tile.topPx + tile.heightPx - 4}px`,
      left: `${tile.leftPx + tile.widthPx / 2 - 13}px`,
      backgroundColor: googleColors[tile.activity.color].contrastColor,
    };
  }

  private timeFromMidnightToString(minsFromMidnight: number): string {
    const hours = Math.floor(minsFromMidnight / 60);
    const minutes = minsFromMidnight % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
