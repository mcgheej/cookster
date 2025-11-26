import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { DragTetheredPlanEnd } from '../../drag-operations/operations/drag-tethered-plan-end';
import { PLAN_END_BAR_HEIGHT } from '@util/app-config/index';
import { rectIntersection } from '@util/misc-utilities/index';

@Component({
  selector: 'ck-preview-tethered-plan-end',
  imports: [MatIconModule],
  template: `
    @if (vm(); as vm) {
      <div class="fixed" [style.top.px]="vm.shadowRect.y" [style.left.px]="vm.shadowRect.x">
        <div
          class="bg-black opacity-20"
          [style.width.px]="vm.shadowRect.width"
          [style.height.px]="vm.shadowRect.height"
          [style.clipPath]="vm.clipPath"></div>
        <div
          class="bg-[var(--mat-sys-primary)]"
          [style.height.px]="planEndBarHeight"
          [style.width.px]="vm.shadowRect.width"></div>
        <div class="h-[16px] pl-1 text-gray-700 text-xs select-none">{{ vm.endTime }}</div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewTetheredPlanEnd extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const { pointerPos, dropArea: baseDropArea, dragOp } = this.previewProps();
    const plan = (dragOp as DragTetheredPlanEnd).plan;
    if (baseDropArea && plan) {
      const dropArea = baseDropArea as DropAreaResourceLaneColumn;
      const dragPos = pointerPos.dragPosition;
      const gridRect = dropArea.activitiesGridRect();
      const gridBoundingRect = dropArea.activitiesGridBoundingRect();
      const pixelsPerHour = dropArea.pixelsPerHour();
      const shadowHeightPx = (plan.properties.durationMins * pixelsPerHour) / 60;
      const shadowRect = DOMRect.fromRect({
        x: gridBoundingRect.left,
        y: dragPos.y - shadowHeightPx,
        width: gridRect.width,
        height: shadowHeightPx,
      });
      const endTime = dropArea.getTimeFromPosition(dragPos, pointerPos.shiftKey);
      const clipArea = rectIntersection(
        shadowRect,
        DOMRect.fromRect({
          x: gridBoundingRect.x,
          y: gridBoundingRect.y,
          width: gridRect.width,
          height: gridRect.height,
        })
      );
      const clipPath = this.getClipPath(clipArea, shadowRect);
      return {
        shadowRect,
        endTime,
        clipPath,
      };
    }
    return undefined;
  });

  protected planEndBarHeight = PLAN_END_BAR_HEIGHT;
}
