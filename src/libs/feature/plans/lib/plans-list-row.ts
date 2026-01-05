import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PlanDetail } from './plan-detail';
import { PlanSummary } from '@util/data-types/index';
import { opaqueColor } from '@util/color-utilities/index';
import { DEFAULT_COLOR_OPACITY, DEFAULT_PLAN_COLOR, googleColors } from '@util/app-config/index';

@Component({
  selector: 'ck-plans-list-row',
  imports: [CommonModule, PlanDetail],
  template: `
    <div class="w-full cursor-pointer text-sm" (click)="onToggleExpand($event)">
      <div class="grid grid-cols-[1fr_250px] grid-rows-[40px]">
        <div class="row-start-1 col-start-1 row-end-3 col-end-2 flex items-center justify-start pl-1 select-none">
          <div>
            @if (expandedPlanId() === planSummary().id) {
              <div class="inline-block size-[10px] rounded-[50%]" [style.backgroundColor]="planColor()"></div>
            } @else {
              <div class="inline-block size-[10px]"></div>
            }
            <div class="inline-block pl-1 select-none">{{ planSummary().name }}</div>
          </div>
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

  protected readonly planColor = computed(() => {
    const color = googleColors[this.planSummary().color].color ?? DEFAULT_PLAN_COLOR;
    return opaqueColor(color, DEFAULT_COLOR_OPACITY);
  });
}
