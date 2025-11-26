import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../../preview-component-base';
import { DragChangeActivityDuration } from '../../../drag-operations/operations/drag-change-activity-duration';
import { DropAreaResourceLaneColumn } from '../drop-area-resource-lane-column';
import { NgStyle } from '@angular/common';
import { opaqueColor } from '@util/color-utilities/index';
import { MatIconModule } from '@angular/material/icon';
import { getActivityEnvelope } from '@util/data-types/index';
import { getDateFromMinutesSinceMidnight } from '@util/date-utilities/index';
import { MIN_ACTIVITY_DURATION_MINS } from '@util/app-config/index';

@Component({
  selector: 'ck-preview-change-activity-duration',
  imports: [NgStyle, MatIconModule],
  templateUrl: './preview-change-activity-duration.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewChangeActivityDuration extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => this.getVM(this.previewProps()));

  get durationMins(): number | undefined {
    return this.getVM(this.previewProps())?.durationMins;
  }

  private getVM(previewProps: PreviewComponentProps) {
    // Pull out commonly used values from previewProps and check essential data present for drop area
    const { pointerPos, dragOp: baseDragOp, dropArea: baseDropArea, clipArea } = previewProps;
    const dropAreaEl = baseDropArea?.hostElement;
    if (!baseDropArea || !baseDropArea.hostElement || !dropAreaEl) {
      return undefined;
    }

    // The displayTile (of type DisplayTile) is the object defining the tile displayed in the resource
    // lane for the subject activity.
    const { dragPosition: dragPos, shiftKey } = pointerPos;
    const dragOp = baseDragOp as DragChangeActivityDuration;
    const dropArea = baseDropArea as DropAreaResourceLaneColumn;
    const displayTile = dragOp.displayTile;
    const pixelsPerHour = dropArea.pixelsPerHour();
    const timeSnapMins = dropArea.timeSnapMins();
    const timeWindow = dropArea.timeWindow();

    // Calculate the y value in the overlay for the top of the preview tile.
    const { top: dropAreaTop, left: dropAreaLeft } = dropAreaEl.getBoundingClientRect();
    const previewTileTop = displayTile.topPx + dropAreaTop;

    // Calculate the drag duration in minutes and pixels from the drag position. If the shift key is held
    // then snap the duration to the time snap interval.
    let dragY = dragPos.y;
    let dragDurationMins = Math.round(((dragY - previewTileTop) / pixelsPerHour) * 60);
    dragDurationMins = shiftKey ? Math.round(dragDurationMins / timeSnapMins) * timeSnapMins : dragDurationMins;
    let dragDurationPixels = Math.round((dragDurationMins / 60) * pixelsPerHour);

    // Check if the duration is less than the minimum allowed duration. If it is then set the duration to the minimum allowed.
    if (dragDurationMins < MIN_ACTIVITY_DURATION_MINS) {
      dragDurationMins = MIN_ACTIVITY_DURATION_MINS;
      dragDurationPixels = Math.round((dragDurationMins / 60) * pixelsPerHour);
    }

    // Calculate the y values in the overlay corresponding to the start of the time window.
    const timeWindowStartY = dropArea.getVerticalPositionFromTime(
      getDateFromMinutesSinceMidnight(timeWindow.startHours * 60)
    );

    // Calculate the y value in the overlay corresponding to the plan end. Do this by using
    // the activity start time offset (number of minutes from the start of the activity to
    // the plan end).
    const planEndY = previewTileTop + Math.round((displayTile.activity.startTimeOffset / 60) * pixelsPerHour);

    // Calculate the y overlay values for the altered activity envelope (envelopeStartY and envelopeEndY).
    const { startTimeOffset: envelopeStartTimeOffset, duration: envelopeDuration } = getActivityEnvelope({
      ...displayTile.activity,
      duration: dragDurationMins,
    });
    let envelopeStartY = planEndY - Math.round((envelopeStartTimeOffset / 60) * pixelsPerHour);
    let envelopeEndY = envelopeStartY + Math.round((envelopeDuration / 60) * pixelsPerHour);

    // Check if the top of the activity envelope is before the start of the time window. If it is adjust the
    // duration to put the top of the envelope at the time window start.
    if (envelopeStartY < timeWindowStartY) {
      dragDurationPixels = dragDurationPixels + (timeWindowStartY - envelopeStartY);
      dragDurationMins = Math.round((dragDurationPixels / pixelsPerHour) * 60);
      envelopeStartY = timeWindowStartY;
    }

    // Check if the bottom of the activity envelope is after the plan end. If it is adjust the duration to put the bottom
    // of the envelope at the plan end.
    if (envelopeEndY > planEndY) {
      dragDurationPixels = dragDurationPixels - (envelopeEndY - planEndY);
      dragDurationMins = Math.round((dragDurationPixels / pixelsPerHour) * 60);
      envelopeEndY = planEndY;
    }

    // Build styles for the preview tile
    const previewTileLeft = displayTile.leftPx + dropAreaLeft;
    const previewTileWidth = displayTile.widthPx;
    const previewTileHeight = dragDurationPixels;
    const clipPath = this.getClipPath(
      clipArea,
      DOMRect.fromRect({ x: previewTileLeft, y: previewTileTop, width: previewTileWidth, height: previewTileHeight })
    );
    const color = displayTile.styles['backgroundColor'] || '#888888';
    const styles = {
      ...displayTile.styles,
      top: `${previewTileTop}px`,
      left: `${previewTileLeft}px`,
      height: `${previewTileHeight}px`,
      position: 'fixed',
      backgroundColor: opaqueColor(color, 0.6),
      clipPath,
    };

    // Calculate duration in hours and minutes
    const durationHours = Math.floor(dragDurationMins / 60);
    let durationMinutes: string | number = dragDurationMins % 60;
    durationMinutes = durationMinutes < 10 ? `0${durationMinutes}` : durationMinutes;

    // Calculate envelope wings data
    const topEnvelopeWing =
      envelopeStartY < previewTileTop
        ? {
            top: envelopeStartY + 4,
            left: previewTileLeft,
            height: previewTileTop - envelopeStartY,
            border: displayTile.styles['border'],
          }
        : undefined;

    const bottomEnvelopeWing =
      envelopeEndY > previewTileTop + previewTileHeight
        ? {
            top: previewTileTop + previewTileHeight - 4,
            left: previewTileLeft,
            height: envelopeEndY - (previewTileTop + previewTileHeight) + 4,
            bottom: envelopeEndY,
            border: displayTile.styles['border'],
          }
        : undefined;

    return {
      name: displayTile.activity.name,
      actionsPresent: displayTile.activity.actions.length > 0,
      styles,
      hours: durationHours,
      minutes: durationMinutes,
      durationMins: dragDurationMins,
      topEnvelopeWing,
      bottomEnvelopeWing,
    };
  }
}
