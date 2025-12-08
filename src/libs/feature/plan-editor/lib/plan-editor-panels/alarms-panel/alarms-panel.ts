import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { CommonModule } from '@angular/common';
import { opaqueColor } from '@util/color-utilities/index';
import { DEFAULT_COLOR_OPACITY, DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { isToday } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'ck-alarms-panel',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="ml-1">
      <div class="inline-block size-[10px] rounded-[50%]" [style.backgroundColor]="flairColor()"></div>
      <div class="inline-block pl-1 pt-2 font-bold text-sm select-none">Alarms:</div>
      @if (showRunAlarmsButton()) {
        <div class="inline-block h-[10px] w-[50px] float-right text-[var(--mat-sys-primary)]">
          <button
            matIconButton
            [matTooltipShowDelay]="tooltipShowDelay"
            matTooltip="run plan alarms"
            (click)="runAlarmsClick($event)">
            <mat-icon>play_circle</mat-icon>
          </button>
        </div>
      }
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsPanel {
  private readonly router = inject(Router);
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly flairColor = computed(() => {
    return opaqueColor(this.planEditorData.planColor(), DEFAULT_COLOR_OPACITY);
  });

  protected readonly showRunAlarmsButton = computed(() => {
    const plan = this.planEditorData.currentPlan();
    if (!plan) {
      return false;
    }
    const planEnd = plan.properties.endTime;
    return isToday(planEnd) && new Date() < planEnd;
  });

  protected readonly tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected readonly alarmGroups = this.planEditorData.alarmGroups;

  protected runAlarmsClick(event: Event): void {
    event.stopPropagation();
    const plan = this.planEditorData.currentPlan();
    if (plan) {
      this.router.navigateByUrl(`/plans/alarms/${plan.properties.id}`);
    }
  }
}
