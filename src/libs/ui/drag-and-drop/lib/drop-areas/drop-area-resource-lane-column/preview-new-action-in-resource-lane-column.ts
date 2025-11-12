import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponentProps } from '../preview-component-base';
import { DropAreaResourceLaneColumn } from './drop-area-resource-lane-column';
import { laneWidthPx, Point } from '@util/data-types/index';
import { format } from 'date-fns';
import { getDateFromMinutesSinceMidnight } from '@util/date-utilities/index';
import { PointerData } from '../../types/pointer-data';
import { rectIntersection } from '@util/misc-utilities/index';

@Component({
  selector: 'ck-preview-new-action-in-resource-lane-column',
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
        <div class="h-[16px] justify-self-end self-start text-gray-700 text-xs select-none">New Action</div>
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
export class PreviewNewActionInResourceLaneColumn {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const { pointerPos, dropArea, clipArea } = this.previewProps();
    if (dropArea) {
      const { hostElement: dropEl } = dropArea as DropAreaResourceLaneColumn;
      if (dropEl) {
        const adjustedPosition = this.getAdjustedPosition(dropEl, pointerPos.dragPosition);
        const laneWidth = laneWidthPx[(dropArea as DropAreaResourceLaneColumn).resourceLane().laneWidth];
        const time = (dropArea as DropAreaResourceLaneColumn).getTimeFromPosition(
          pointerPos.dragPosition,
          pointerPos.shiftKey
        );
        const clipPath = this.getClipPath(
          clipArea,
          DOMRect.fromRect({ x: adjustedPosition.x, y: adjustedPosition.y, width: laneWidth, height: 32 })
        );
        return { adjustedPosition, laneWidth, time, clipPath };
      }
    }
    return {
      adjustedPosition: { x: 0, y: 0 },
      laneWidth: 0,
      time: '00:00',
      clipPath: 'none',
    };
  });

  private getClipPath(clipArea: DOMRect | undefined, actionTileRect: DOMRect): string {
    if (clipArea) {
      const clippedRect = rectIntersection(clipArea, actionTileRect);
      if (clippedRect) {
        const topInset = Math.abs(clippedRect.top - actionTileRect.top);
        const rightInset = Math.abs(clippedRect.right - actionTileRect.right);
        const bottomInset = Math.abs(clippedRect.bottom - actionTileRect.bottom);
        const leftInset = Math.abs(clippedRect.left - actionTileRect.left);
        return `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`;
      }
    }
    return 'none';
  }

  private getAdjustedPosition(dropEl: HTMLElement, dragPosition: Point): Point {
    const laneRect = dropEl.getBoundingClientRect();
    const y = dragPosition.y - 16;
    const x = laneRect.left;
    return { x, y };
  }
}
