import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { laneWidthPx, Point } from '@util/data-types/index';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { DragMoveResourceAction } from '../../drag-operations/drag-move-resource-action/drag-move-resource-action';

@Component({
  selector: 'ck-preview-move-action-in-lane-column',
  imports: [MatIconModule],
  template: `
    <div
      class="fixed grid grid-cols-[1fr]"
      [style.width.px]="vm().laneWidth"
      [style.top.px]="vm().adjustedPosition.y"
      [style.left.px]="vm().adjustedPosition.x"
      [style.clipPath]="vm().clipPath">
      <div class="row-start-1 row-end-2 col-start-1 col-end-1 grid grid-cols-[1fr_1fr_16px] grid-rows-[32px]">
        <div class="h-[16px] pl-1 justify-self-start self-start text-gray-700 text-xs select-none">
          {{ vm().time }}
        </div>
        <div class="h-[16px] justify-self-end self-start text-gray-700 text-xs select-none">{{ vm().name }}</div>
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewMoveActionInResourceLaneColumn extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const { pointerPos, dragOp, dropArea: baseDropArea, clipArea } = this.previewProps();
    const plan = (dragOp as DragMoveResourceAction).plan;
    if (baseDropArea && plan) {
      const dropArea = baseDropArea as DropAreaResourceLaneColumn;
      const dropEl = dropArea.hostElement;
      if (dropEl) {
        const planEndPx = dropArea.getVerticalPositionFromTime(plan.properties.endTime);
        const pos = { ...pointerPos.dragPosition, y: Math.min(pointerPos.dragPosition.y, planEndPx) };
        const adjustedPosition = this.getAdjustedPosition(dropEl, pos);

        const laneWidth = laneWidthPx[dropArea.resourceLane().laneWidth];
        const time = dropArea.getTimeFromPosition(pos, pointerPos.shiftKey);
        const clipPath = this.getClipPath(
          clipArea,
          DOMRect.fromRect({ x: adjustedPosition.x, y: adjustedPosition.y, width: laneWidth, height: 32 })
        );
        const name = (dragOp as DragMoveResourceAction).resourceAction.name;
        return { adjustedPosition, laneWidth, time, clipPath, name };
      }
    }
    return {
      adjustedPosition: { x: 0, y: 0 },
      laneWidth: 0,
      time: '00:00',
      clipPath: 'none',
      name: '',
    };
  });

  private getAdjustedPosition(dropEl: HTMLElement, dragPosition: Point): Point {
    const laneRect = dropEl.getBoundingClientRect();
    const y = dragPosition.y - 16;
    const x = laneRect.left;
    return { x, y };
  }
}
