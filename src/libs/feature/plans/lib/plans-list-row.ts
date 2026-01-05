import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PlanDetail } from './plan-detail';
import { PlanSummary } from '@util/data-types/index';

@Component({
  selector: 'ck-plans-list-row',
  imports: [CommonModule, PlanDetail],
  template: `
    <div class="w-full cursor-pointer text-sm" (click)="onToggleExpand($event)">
      <div class="grid grid-cols-[1fr_250px] grid-rows-[40px]">
        <div class="row-start-1 col-start-1 row-end-3 col-end-2 flex items-center justify-start pl-1 select-none">
          {{ planSummary().name }}
        </div>
        <div class="row-start-1 col-start-2 row-end-3 col-end-2 pl-1 flex items-center justify-end">
          {{ planSummary().dateTime | date: 'd LLL yyyy, HH:mm' }}
        </div>
      </div>
      @if (expandedPlanId() === planSummary().id) {
        <ck-plan-detail
          [planSummary]="planSummary()"
          (openPlanEditor)="openPlanEditor.emit()"
          (editPlanProperties)="editPlanProperties.emit()"
          (copyPlan)="copyPlan.emit()"
          (deletePlan)="deletePlan.emit()"
          (runAlarms)="runAlarms.emit()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansListRow {
  readonly planSummary = input.required<PlanSummary>();
  readonly expandedPlanId = input.required<string>();
  protected readonly toggleExpand = output<void>();
  protected readonly openPlanEditor = output<void>();
  protected readonly editPlanProperties = output<void>();
  protected readonly copyPlan = output<void>();
  protected readonly deletePlan = output<void>();
  protected readonly runAlarms = output<void>();

  protected onToggleExpand(ev: MouseEvent): void {
    ev.stopPropagation();
    this.toggleExpand.emit();
  }
}
