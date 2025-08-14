import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlanSummary } from '@util/data-types/index';

@Component({
  selector: 'ck-plan-detail',
  imports: [MatButtonModule, MatIconModule],
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
          <button matIconButton matTooltip="edit plan" (click)="editPlanClick($event)">
            <mat-icon>edit</mat-icon>
          </button>
          <button matIconButton matTooltip="copy plan" (click)="copyPlanClick($event)">
            <mat-icon>folder_copy</mat-icon>
          </button>
          <button matIconButton matTooltip="delete plan" (click)="deletePlanClick($event)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetail {
  readonly planSummary = input.required<PlanSummary>();
  protected readonly editPlan = output<void>();
  protected readonly copyPlan = output<void>();
  protected readonly deletePlan = output<void>();

  protected editPlanClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.editPlan.emit();
  }

  protected copyPlanClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.copyPlan.emit();
  }

  protected deletePlanClick(ev: MouseEvent): void {
    ev.stopPropagation();
    this.deletePlan.emit();
  }
}
