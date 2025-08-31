import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlansListRow } from './plans-list-row';
import { PlanSummary } from '@util/data-types/index';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';

@Component({
  selector: 'ck-plans-list',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, PlansListRow],
  template: `
    <div class="my-0 mx-auto w-[80%] text-base sm:w-[600px] grid grid-cols-[1fr] grid-rows-[auto,_auto] pt-2">
      @if (planSummaries().length > 0) {
        <div class="w-full grid grid-cols-[1fr_75px] h-14 font-semibold border-b-2 border-slate-400">
          <div class="flex items-center">Name</div>
          <div class="flex items-center justify-end">Date</div>
        </div>
        @for (planSummary of planSummaries(); track planSummary.id) {
          <div class="grid grid-col-[1fr]">
            <ck-plans-list-row
              [planSummary]="planSummary"
              [expandedPlanId]="expandedPlanSummaryId"
              (editPlan)="editPlanClick(planSummary)"
              (copyPlan)="copyPlanClick(planSummary)"
              (deletePlan)="deletePlanClick(planSummary)"
              (toggleExpand)="onToggleExpand(planSummary)"></ck-plans-list-row>
            <div class="h-0.5 bg-slate-400"></div>
          </div>
        }
      } @else {
        <div class="w-full mt-2 h-20 grid grid-cols-[1fr] border-2 border-slate-400">
          <div class="my-0 mx-auto flex items-center">No plans available</div>
        </div>
      }
    </div>
    <div class="fixed bottom-6 right-6">
      <button mat-fab [matTooltipShowDelay]="tooltipShowDelay" matTooltip="add new plan" (click)="addPlanClick($event)">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansList {
  readonly planSummaries = input.required<PlanSummary[]>();
  protected readonly addPlan = output<void>();
  protected readonly editPlan = output<PlanSummary>();
  protected readonly copyPlan = output<PlanSummary>();
  protected readonly deletePlan = output<PlanSummary>();

  protected expandedPlanSummaryId = '';
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected addPlanClick(ev: MouseEvent) {
    ev.stopPropagation();
    this.addPlan.emit();
  }

  protected editPlanClick(planSummary: PlanSummary) {
    this.expandedPlanSummaryId = '';
    this.editPlan.emit(planSummary);
  }

  protected copyPlanClick(planSummary: PlanSummary) {
    this.expandedPlanSummaryId = '';
    this.copyPlan.emit(planSummary);
  }

  protected deletePlanClick(planSummary: PlanSummary) {
    this.expandedPlanSummaryId = '';
    this.deletePlan.emit(planSummary);
  }

  protected onToggleExpand(planSummary: PlanSummary) {
    if (planSummary.id === this.expandedPlanSummaryId) {
      this.expandedPlanSummaryId = '';
    } else {
      this.expandedPlanSummaryId = planSummary.id;
    }
  }
}
