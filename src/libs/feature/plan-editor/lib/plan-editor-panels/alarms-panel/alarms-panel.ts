import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { CommonModule } from '@angular/common';
import { opaqueColor } from '@util/color-utilities/index';
import { DEFAULT_COLOR_OPACITY } from '@util/app-config/index';

@Component({
  selector: 'ck-alarms-panel',
  template: `
    <div class="ml-1">
      <div class="inline-block size-[10px] rounded-[50%]" [style.backgroundColor]="flairColor()"></div>
      <div class="inline-block pl-1 pt-2 font-bold text-sm select-none">Alarms:</div>
    </div>
    @if (alarmGroups().length === 0) {
      <div>No alarms</div>
    } @else {
      <div class="mt-1 ml-[18px]">
        @for (alarmGroup of alarmGroups(); track $index; let isOdd = $odd) {
          <div class="mt-1">
            @for (alarm of alarmGroup.alarms; track $index; let isFirst = $first) {
              <div
                class="grid grid-cols-[35px_1fr] gap-1"
                [style.backgroundColor]="isOdd ? 'var(--mat-sys-surface-variant)' : 'var(--mat-sys-surface)'">
                <div>{{ isFirst ? alarm.timeString : '' }}</div>
                <div>{{ alarm.message }}</div>
              </div>
            }
          </div>
        }
      </div>
    }
  `,
  // templateUrl: './alarms-panel.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsPanel {
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly flairColor = computed(() => {
    return opaqueColor(this.planEditorData.planColor(), DEFAULT_COLOR_OPACITY);
  });

  protected readonly alarmGroups = this.planEditorData.alarmGroups;
}
