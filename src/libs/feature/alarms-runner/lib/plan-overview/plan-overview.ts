import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlansDataService } from '@data-access/plans/index';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { Plan } from '@util/data-types/index';
import { format } from 'date-fns';

@Component({
  selector: 'ck-plan-overview',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    @if (currentPlan(); as plan) {
      <div class="h-full grid grid-rows-[minmax(0,1fr)_auto] grid-cols-1">
        <div>
          <div class="ml-1">
            <div class="inline-block size-2.5 rounded-[50%]" [style.backgroundColor]="planColor()"></div>
            <div class="inline-block pl-1 pt-2 font-bold text-sm select-none">Plan:</div>
          </div>
          <div class="pl-4.5 text-sm select-none">{{ plan.properties.name }}</div>
          <div class="pl-4.5 pt-2 font-bold text-sm select-none">Date:</div>
          <div class="pl-4.5 text-sm select-none">
            {{ format(plan.properties.endTime, 'EEE, do LLL, yyyy - HH:mm') }}
          </div>
          <div class="pl-4.5 pt-2 font-bold text-sm select-none">Starting at:</div>
          <div class="pl-4.5 text-sm select-none">{{ format(plan.properties.startTime, 'HH:mm') }}</div>
          <div class="pl-4.5 pt-2 font-bold text-sm select-none">Description:</div>
          <div class="ml-3.25 mt-1 border border-(--mat-sys-secondary-fixed) w-68.25 h-20 overflow-auto">
            <div class="pl-1 pr-1 text-sm select-none">{{ plan.properties.description || 'No description' }}</div>
          </div>
          <div class="pt-2 pl-4.5">
            <button
              matIconButton
              [matTooltipShowDelay]="tooltipShowDelay"
              matTooltip="edit plan"
              (click)="editClick(plan)">
              <mat-icon>edit</mat-icon>
            </button>
          </div>
        </div>
        <div class="justify-self-center text-8xl mb-4 text-(--mat-sys-tertiary)">
          {{ formattedTime() }}
        </div>
      </div>
    }
  `,
})
export class PlanOverview {
  private readonly plansData = inject(PlansDataService);

  readonly currentTime = input.required<Date>();
  protected readonly editPlan = output<string>();

  protected readonly currentPlan = this.plansData.currentPlan;
  protected readonly planColor = this.plansData.currentPlanColor;

  protected readonly formattedTime = computed(
    () => {
      return format(this.currentTime(), 'HH:mm');
    },
    {
      equal: (a, b) => a === b,
    }
  );

  protected format = format;
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected editClick(plan: Plan): void {
    this.editPlan.emit(plan.properties.id);
  }
}
