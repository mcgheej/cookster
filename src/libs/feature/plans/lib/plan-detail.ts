import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { PlanSummary } from '@util/data-types/index';
import { isToday } from 'date-fns';

@Component({
  selector: 'ck-plan-detail',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="h-40 w-full grid grid-cols-[1fr]">
      <div class="grid grid-cols-[1fr] px-2 py-0 font-light">
        <span class="inline-block">
          <span>Cooking in '{{ planSummary().kitchenName }}'</span>
        </span>
        <div class="border border-gray-300 w-full min-h-[30px] max-h-[75px] overflow-auto">
          <div class="pl-1 pr-1 select-none">{{ planSummary().description }}</div>
        </div>
        <div class="mt-2 grid grid-cols-[50px_50px_50px_1fr]">
          <button
            matIconButton
            [matTooltipShowDelay]="tooltipShowDelay"
            matTooltip="open plan editor"
            (click)="openPlanEditorClick($event)">
            <mat-icon>edit</mat-icon>
          </button>
          <button
            matIconButton
            [matTooltipShowDelay]="tooltipShowDelay"
            matTooltip="copy plan"
            (click)="copyPlanClick($event)">
            <mat-icon>folder_copy</mat-icon>
          </button>
          <button
            matIconButton
            [matTooltipShowDelay]="tooltipShowDelay"
            matTooltip="delete plan"
            (click)="deletePlanClick($event)">
            <mat-icon>delete</mat-icon>
          </button>
          @if (showRunAlarmsButton()) {
            <button
              matIconButton
              [matTooltipShowDelay]="tooltipShowDelay"
              matTooltip="run plan alarms"
              (click)="runAlarmsClick($event)">
              <mat-icon>play_circle</mat-icon>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetail {
  readonly planSummary = input.required<PlanSummary>();
  protected readonly openPlanEditor = output<void>();
  protected readonly copyPlan = output<void>();
  protected readonly deletePlan = output<void>();
  protected readonly runAlarms = output<void>();

  protected readonly showRunAlarmsButton = computed(() => {
    const planEnd = this.planSummary().dateTime;
    return isToday(planEnd) && new Date() < planEnd;
  });

  protected readonly tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected openPlanEditorClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.openPlanEditor.emit();
  }

  protected copyPlanClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.copyPlan.emit();
  }

  protected deletePlanClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.deletePlan.emit();
  }

  protected runAlarmsClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.runAlarms.emit();
  }
}
