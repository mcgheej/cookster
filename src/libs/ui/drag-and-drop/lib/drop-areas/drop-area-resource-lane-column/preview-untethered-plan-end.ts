import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { PLAN_END_BAR_HEIGHT } from '@util/app-config/index';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { getDateFromMinutesSinceMidnight } from '@util/date-utilities/index';
import { DragUntetheredPlanEnd } from '../../drag-operations/operations/drag-untethered-plan-end';
import { format } from 'date-fns';
import { rectIntersection } from '@util/misc-utilities/index';

@Component({
  selector: 'ck-preview-untethered-plan-end',
  template: `
    @if (vm(); as vm) {
      <div class="fixed" [style.top.px]="vm.planEndBarRect.y" [style.left.px]="vm.planEndBarRect.x">
        <div
          class="bg-[var(--mat-sys-primary)]"
          [style.height.px]="vm.planEndBarRect.height"
          [style.width.px]="vm.planEndBarRect.width"
          [style.clipPath]="vm.clipPath"></div>
        <div class="h-[16px] pl-1 text-gray-700 text-xs select-none">{{ vm.planEndString }}</div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewUntetheredPlanEnd extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  get planEnd(): Date | undefined {
    const vm = this.getVM(this.previewProps());
    if (vm) {
      return vm.planEnd;
    }
    return undefined;
  }

  protected readonly vm = computed(() => this.getVM(this.previewProps()));

  private getVM(previewProps: PreviewComponentProps) {
    // Pull out commonly used values and initialise local reference for plan and
    // check essential data present
    const { pointerPos, dropArea: baseDropArea, dragOp } = previewProps;
    const plan = (dragOp as DragUntetheredPlanEnd).plan;
    const dropAreaEl = baseDropArea?.hostElement;
    if (!baseDropArea || !plan || !dropAreaEl) {
      return undefined;
    }

    // Initialise local references for drop area properties and pointer position
    const { dragPosition: dragPos, shiftKey } = pointerPos;
    const dropArea = baseDropArea as DropAreaResourceLaneColumn;
    const pixelsPerHour = dropArea.pixelsPerHour();
    const timeSnapMins = dropArea.timeSnapMins();
    const timeWindow = dropArea.timeWindow();
    const gridRect = dropArea.activitiesGridRect();
    const gridBoundingRect = dropArea.activitiesGridBoundingRect();

    // Apply any time snap required. Time snap is applied the the plan end.
    const dropAreaTop = dropAreaEl.getBoundingClientRect().top;
    let planEndY = dragPos.y;
    let planEndMins = Math.round(((planEndY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    planEndMins = shiftKey ? Math.round(planEndMins / timeSnapMins) * timeSnapMins : planEndMins;
    planEndY = Math.round(((planEndMins - timeWindow.startHours * 60) / 60) * pixelsPerHour + dropAreaTop);

    // Adjust the plan end if it is before the existing plan content
    const contentEndY = dropArea.getVerticalPositionFromTime(plan.properties.contentEnd);
    if (planEndY < contentEndY) {
      planEndY = contentEndY;
      planEndMins = Math.round(((planEndY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    }

    // Calculate the plan bar rectangle
    const planEndBarRect = DOMRect.fromRect({
      x: gridBoundingRect.left,
      y: planEndY,
      width: gridRect.width,
      height: PLAN_END_BAR_HEIGHT,
    });

    const clipArea = rectIntersection(
      planEndBarRect,
      DOMRect.fromRect({
        x: gridBoundingRect.x,
        y: gridBoundingRect.y,
        width: gridRect.width,
        height: gridRect.height,
      })
    );
    const clipPath = this.getClipPath(clipArea, planEndBarRect);

    const planEnd = getDateFromMinutesSinceMidnight(planEndMins, plan.properties.endTime);
    return {
      planEndBarRect,
      planEnd,
      planEndString: format(planEnd, 'HH:mm'),
      clipPath,
    };
  }
}
