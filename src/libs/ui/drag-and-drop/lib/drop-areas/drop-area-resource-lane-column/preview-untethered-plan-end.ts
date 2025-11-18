import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { PLAN_END_BAR_HEIGHT } from '@util/app-config/index';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { DragUntetheredPlanEnd } from '../../drag-operations/drag-untethered-plan-end/drag-untethered-plan-end';

@Component({
  selector: 'ck-preview-untethered-plan-end',
  template: `
    @if (vm(); as vm) {
      <div class="fixed" [style.top.px]="vm.planEndBarRect.y" [style.left.px]="vm.planEndBarRect.x">
        <div
          class="bg-[var(--mat-sys-primary)]"
          [style.height.px]="vm.planEndBarRect.height"
          [style.width.px]="vm.planEndBarRect.width"></div>
        <div class="h-[16px] pl-1 text-gray-700 text-xs select-none">{{ vm.endTime }}</div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewUntetheredPlanEnd extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const { pointerPos, dropArea: baseDropArea, dragOp } = this.previewProps();
    const plan = (dragOp as DragUntetheredPlanEnd).plan;
    if (baseDropArea && plan) {
      const dropArea = baseDropArea as DropAreaResourceLaneColumn;
      const { timeWindow, pixelsPerHour, scrollY, activitiesGridRect, activitiesGridBoundingRect } = dropArea;
      const dragPos = pointerPos.dragPosition;
      const gridRect = activitiesGridRect();
      const gridBoundingRect = activitiesGridBoundingRect();
      const contentEndPx =
        (getMinutesSinceMidnight(plan.properties.contentEnd) / 60 - timeWindow().startHours) * pixelsPerHour() -
        scrollY() +
        gridBoundingRect.top;
      const pos = { ...dragPos, y: Math.max(dragPos.y, contentEndPx) };
      const planEndBarRect = DOMRect.fromRect({
        x: gridBoundingRect.left,
        y: pos.y,
        width: gridRect.width,
        height: PLAN_END_BAR_HEIGHT,
      });
      const endTime = dropArea.getTimeFromPosition(pos, pointerPos.shiftKey);
      return {
        planEndBarRect,
        endTime,
      };
    }
    return undefined;
  });
}
