import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../../preview-component-base';
import { DragActivity } from '@ui/drag-and-drop/lib/drag-operations/operations/drag-activity';
import { DropAreaResourceLaneColumn } from '../drop-area-resource-lane-column';
import { getDateFromMinutesSinceMidnight, getMinutesSinceMidnight } from '@util/date-utilities/index';
import { getActivityEnvelope, ResourceLane } from '@util/data-types/index';
import { ACTIVITY_TILES_LEFT_MARGIN_PX, ACTIVITY_TILES_RIGHT_MARGIN_PX } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { format } from 'date-fns';

@Component({
  selector: 'ck-preview-move-activity',
  imports: [CommonModule, MatIconModule],
  templateUrl: './preview-move-activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewMoveActivity extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => this.getVM(this.previewProps()));

  get activityPosition(): { timeOffset: number; resourceLane: ResourceLane } | undefined {
    const vm = this.getVM(this.previewProps());
    if (vm) {
      return {
        timeOffset: vm.timeOffset,
        resourceLane: vm.resourceLane,
      };
    }
    return undefined;
  }

  private getVM(previewProps: PreviewComponentProps) {
    // Pull out commonly used values from previewProps and check essential data present for drop area
    const { pointerPos, dragOp: baseDragOp, dropArea: baseDropArea, clipArea } = previewProps;
    const dropAreaEl = baseDropArea?.hostElement;
    const plan = (baseDragOp as DragActivity).plan;
    if (!baseDropArea || !baseDropArea.hostElement || !dropAreaEl || !plan) {
      return undefined;
    }

    // The displayTile (of type DisplayTile) is the object defining the tile displayed in the resource
    // lane for the subject activity.
    const { dragPosition: dragPos, shiftKey } = pointerPos;
    const dragOp = baseDragOp as DragActivity;
    const dropArea = baseDropArea as DropAreaResourceLaneColumn;
    const displayTile = dragOp.displayTile;
    const pixelsPerHour = dropArea.pixelsPerHour();
    const timeSnapMins = dropArea.timeSnapMins();
    const timeWindow = dropArea.timeWindow();

    // Use the drag position for the y value in the overlay for the top of the preview tile. Also
    // calculate the corresponding start time in minutes since midnight.
    const { top: dropAreaTop, left: dropAreaLeft, width: dropAreaWidth } = dropAreaEl.getBoundingClientRect();
    let activityStartY = dragPos.y;
    let activityStartMins =
      Math.round(((activityStartY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
    activityStartMins = shiftKey ? Math.round(activityStartMins / timeSnapMins) * timeSnapMins : activityStartMins;
    activityStartY = Math.round(((activityStartMins - timeWindow.startHours * 60) / 60) * pixelsPerHour + dropAreaTop);

    // Calculate the y value in the overlay corresponding to the start of the time window.
    const timeWindowStartY = dropArea.getVerticalPositionFromTime(
      getDateFromMinutesSinceMidnight(timeWindow.startHours * 60)
    );

    // Calculate the y value in the overlay corresponding to the plan end. Do this by using
    // the activity start time offset (number of minutes from the start of the activity to
    // the plan end).
    const activityTileTop = displayTile.topPx + dropAreaTop;
    const planEndY = activityTileTop + Math.round((displayTile.activity.startTimeOffset / 60) * pixelsPerHour);

    // Calculate the y overlay values for the altered activity envelope (envelopeStartY and envelopeEndY).
    const planEndMinsSinceMidnight = getMinutesSinceMidnight(plan.properties.endTime);
    let { startTimeOffset: envelopeStartTimeOffset, duration: envelopeDuration } = getActivityEnvelope({
      ...displayTile.activity,
      startTimeOffset: planEndMinsSinceMidnight - activityStartMins,
    });
    let envelopeStartY = planEndY - Math.round((envelopeStartTimeOffset / 60) * pixelsPerHour);
    let envelopeEndY = envelopeStartY + Math.round((envelopeDuration / 60) * pixelsPerHour);

    // Check if the top of the activity envelope is above the start of the time window. If it is then
    // adjust the dragged activity start to put the envelope at hte time window start.
    if (envelopeStartY < timeWindowStartY) {
      activityStartY = activityStartY + (timeWindowStartY - envelopeStartY);
      activityStartMins =
        Math.round(((activityStartY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
      // envelopeStartY = timeWindowStartY;
    }

    // Check the bottom of the activity envelope is after the plan end. If it is adjust the dragged activity start
    // to put the envelope end at the plan end.
    if (envelopeEndY > planEndY) {
      activityStartY = activityStartY - (envelopeEndY - planEndY);
      activityStartMins =
        Math.round(((activityStartY - dropAreaTop) / pixelsPerHour) * 60) + timeWindow.startHours * 60;
      // envelopeEndY = planEndY;
    }
    const t = getActivityEnvelope({
      ...displayTile.activity,
      startTimeOffset: planEndMinsSinceMidnight - activityStartMins,
    });
    envelopeStartTimeOffset = t.startTimeOffset;
    envelopeDuration = t.duration;
    envelopeStartY = planEndY - Math.round((envelopeStartTimeOffset / 60) * pixelsPerHour);
    envelopeEndY = envelopeStartY + Math.round((envelopeDuration / 60) * pixelsPerHour);

    // Build styles for the preview tile
    const previewTileTop = activityStartY;
    const previewTileLeft = dropAreaLeft + ACTIVITY_TILES_LEFT_MARGIN_PX;
    const previewTileWidth = dropAreaWidth - ACTIVITY_TILES_LEFT_MARGIN_PX - ACTIVITY_TILES_RIGHT_MARGIN_PX;
    const previewTileHeight = Math.round((displayTile.activity.duration / 60) * pixelsPerHour);
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
      width: `${previewTileWidth}px`,
      position: 'fixed',
      backgroundColor: opaqueColor(color, 0.6),
      clipPath,
    };

    // Calculate new start time as a string
    const newStartTime = format(getDateFromMinutesSinceMidnight(activityStartMins), 'HH:mm');

    // Calculate envelope wings data
    const topEnvelopeWing =
      envelopeStartY < previewTileTop
        ? {
            top: envelopeStartY,
            left: previewTileLeft,
            height: previewTileTop - envelopeStartY + 4,
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
      newStartTime,
      timeOffset: planEndMinsSinceMidnight - activityStartMins,
      topEnvelopeWing,
      bottomEnvelopeWing,
      resourceLane: dropArea.resourceLane(),
    };
  }
}
