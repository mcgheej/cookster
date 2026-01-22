import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { DragTetheredPlanEnd } from '../../drag-operations/operations/drag-tethered-plan-end';
import { PLAN_END_BAR_HEIGHT } from '@util/app-config/index';
import { rectIntersection } from '@util/misc-utilities/index';
import { getDateFromMinutesSinceMidnight } from '@util/date-utilities/index';
import { format } from 'date-fns';

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
          class="bg-(--mat-sys-primary)"
          [style.height.px]="planEndBarHeight"
          [style.width.px]="vm.shadowRect.width"></div>
        <div class="h-4 pl-1 text-gray-700 text-xs select-none">{{ vm.planEndString }}</div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewTetheredPlanEnd extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  get planEnd(): Date | undefined {
    const vm = this.getVM(this.previewProps());
    if (vm) {
      return vm.planEnd;
    }
    return undefined;
  }

  protected readonly vm = computed(() => this.getVM(this.previewProps()));

  protected planEndBarHeight = PLAN_END_BAR_HEIGHT;

  private getVM(previewProps: PreviewComponentProps) {
    // Pull out commonly used values and initialise local reference for plan and
    // check essential data present
    const { pointerPos, dropArea: baseDropArea, dragOp } = previewProps;
    const plan = (dragOp as DragTetheredPlanEnd).plan;
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

    // Apply any time snap required. Time snap is applied the the plan end, not the top
    // if the shadow rectangle. This results with y value for plan end in overlay
    const dropAreaTop = dropAreaEl.getBoundingClientRect().top;
    let planEndY = dragPos.y;
    let planEndMins = Math.round(((planEndY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    planEndMins = shiftKey ? Math.round(planEndMins / timeSnapMins) * timeSnapMins : planEndMins;
    planEndY = Math.round(((planEndMins - timeWindow.startHours * 60) / 60) * pixelsPerHour + dropAreaTop);

    // Calculate the shadow rectangle for the plan (area of grid covered by the plan). The
    // current drag position indicates the end time of the plan, therefore the bottom of
    // the shadow rectangle. The height of the rectangle is determined by the plan duration.
    const shadowHeightPx = (plan.properties.durationMins * pixelsPerHour) / 60;
    const shadowRect = DOMRect.fromRect({
      x: gridBoundingRect.left,
      y: planEndY - shadowHeightPx,
      width: gridRect.width,
      height: shadowHeightPx,
    });

    // Finally adjust the shadow rectangle if it extends above the time window start
    const timeWindowStartY = dropArea.getVerticalPositionFromTime(
      getDateFromMinutesSinceMidnight(timeWindow.startHours * 60)
    );
    if (shadowRect.y < timeWindowStartY) {
      shadowRect.y = timeWindowStartY;
      planEndY = shadowRect.y + shadowRect.height;
      planEndMins = Math.round(((planEndY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    }
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

    const planEnd = getDateFromMinutesSinceMidnight(planEndMins, plan.properties.endTime);
    return {
      shadowRect,
      planEnd,
      planEndString: format(planEnd, 'HH:mm'),
      clipPath,
    };
  }
}
