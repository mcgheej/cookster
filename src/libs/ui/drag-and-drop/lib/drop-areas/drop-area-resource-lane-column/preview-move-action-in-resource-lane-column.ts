import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { laneWidthPx } from '@util/data-types/index';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { DragMoveResourceAction } from '../../drag-operations/operations/drag-move-resource-action';
import { getDateFromMinutesSinceMidnight } from '@util/date-utilities/index';
import { format } from 'date-fns';

@Component({
  selector: 'ck-preview-move-action-in-lane-column',
  imports: [MatIconModule],
  template: `
    @if (vm(); as vm) {
      <div
        class="fixed grid grid-cols-[1fr]"
        [style.width.px]="vm.actionTimeRect.width"
        [style.top.px]="vm.actionTimeRect.y"
        [style.left.px]="vm.actionTimeRect.x"
        [style.clipPath]="vm.clipPath">
        <div class="row-start-1 row-end-2 col-start-1 col-end-1 grid grid-cols-[1fr_1fr_16px] grid-rows-[32px]">
          <div class="h-[16px] pl-1 justify-self-start self-start text-gray-700 text-xs select-none">
            {{ vm.actionTimeString }}
          </div>
          <div class="h-[16px] justify-self-end self-start text-gray-700 text-xs select-none">{{ vm.name }}</div>
          <div></div>
        </div>
        <div class="row-start-1 row-end-2 col-start-1 col-end-1 grid grid-cols-[1fr_16px] grid-rows-[32px]">
          <div class="wave w-full h-1 bg-gray-500 self-center"></div>
          <mat-icon
            class="self-center cursor-pointer"
            [style.color]="'#6a7282'"
            [style.fontSize.px]="16"
            [style.height.px]="16"
            [style.width.px]="16"
            >electric_bolt</mat-icon
          >
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewMoveActionInResourceLaneColumn extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  get actionTime(): Date | undefined {
    const vm = this.getVM(this.previewProps());
    if (vm) {
      return vm.actionTime;
    }
    return undefined;
  }

  protected readonly vm = computed(() => this.getVM(this.previewProps()));

  private getVM(previewProps: PreviewComponentProps) {
    // Pull out commonly used values and initialise local reference for plan and
    // check essential data present
    const { pointerPos, dropArea: baseDropArea, dragOp, clipArea } = previewProps;
    const plan = (dragOp as DragMoveResourceAction).plan;
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

    // Apply any time snap required.
    const dropAreaTop = dropAreaEl.getBoundingClientRect().top;
    let actionTimeY = dragPos.y;
    let actionTimeMins = Math.round(((actionTimeY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    actionTimeMins = shiftKey ? Math.round(actionTimeMins / timeSnapMins) * timeSnapMins : actionTimeMins;
    actionTimeY = Math.round(((actionTimeMins - timeWindow.startHours * 60) / 60) * pixelsPerHour + dropAreaTop);

    // Adjust the action time if it is after the existing plan end time
    const planEndY = dropArea.getVerticalPositionFromTime(plan.properties.endTime);
    if (actionTimeY > planEndY) {
      actionTimeY = planEndY;
      actionTimeMins = Math.round(((actionTimeY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    }

    // Calculate the resource component rectangle
    const dropAreaLeft = dropAreaEl.getBoundingClientRect().left;
    const laneWidth = laneWidthPx[dropArea.resourceLane().laneWidth];
    const actionTimeRect = DOMRect.fromRect({
      x: dropAreaLeft,
      y: actionTimeY - 16,
      width: laneWidth,
      height: 32,
    });

    const clipPath = this.getClipPath(clipArea, actionTimeRect);

    const actionTime = getDateFromMinutesSinceMidnight(actionTimeMins, plan.properties.startTime);
    return {
      name: (dragOp as DragMoveResourceAction).resourceAction.name,
      actionTimeRect,
      actionTime,
      actionTimeString: format(actionTime, 'HH:mm'),
      clipPath,
    };
  }
}
