import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../../preview-component-base';
import { DragActivity } from '@ui/drag-and-drop/lib/drag-operations/operations/drag-activity';
import { DropAreaResourceLaneColumn } from '../drop-area-resource-lane-column';
import { getDateFromMinutesSinceMidnight, getMinutesSinceMidnight } from '@util/date-utilities/index';
import { getActivityEnvelope, ResourceLane } from '@util/data-types/index';
import {
  ACTIVITY_TILES_LEFT_MARGIN_PX,
  ACTIVITY_TILES_RIGHT_MARGIN_PX,
  DEFAULT_COLOR_OPACITY,
  googleColors,
} from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { format, subMinutes } from 'date-fns';

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
    const dragOp = baseDragOp as DragActivity;
    const plan = dragOp.plan;
    if (!baseDropArea || !baseDropArea.hostElement || !dropAreaEl || !plan) {
      return undefined;
    }

    // The displayTile (of type DisplayTile) is the object defining the tile displayed in the resource
    // lane for the subject activity.
    const { dragPosition: dragPos, shiftKey } = pointerPos;
    const dropArea = baseDropArea as DropAreaResourceLaneColumn;
    const targetActivity = dragOp.activity;
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
    const activityTileTop = dropArea.getVerticalPositionFromTime(
      subMinutes(plan.properties.endTime, targetActivity.startTimeOffset)
    );
    const planEndY = activityTileTop + Math.round((targetActivity.startTimeOffset / 60) * pixelsPerHour);

    // Calculate the y overlay values for the altered activity envelope (envelopeStartY and envelopeEndY).
    const planEndMinsSinceMidnight = getMinutesSinceMidnight(plan.properties.endTime);
    let { startTimeOffset: envelopeStartTimeOffset, duration: envelopeDuration } = getActivityEnvelope({
      ...targetActivity,
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
      ...targetActivity,
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
    const previewTileHeight = Math.round((targetActivity.duration / 60) * pixelsPerHour);
    const clipPath = this.getClipPath(
      clipArea,
      DOMRect.fromRect({ x: previewTileLeft, y: previewTileTop, width: previewTileWidth, height: previewTileHeight })
    );
    const color = googleColors[targetActivity.color].color || '#888888';
    const styles = {
      boxSizing: 'border-box',
      border: `2px solid ${googleColors[targetActivity.color].contrastColor}`,
      position: 'fixed',
      borderLeftWidth: '4px',
      borderRightWidth: '4px',
      top: `${previewTileTop}px`,
      left: `${previewTileLeft}px`,
      height: `${previewTileHeight}px`,
      width: `${previewTileWidth}px`,
      backgroundColor: opaqueColor(color, DEFAULT_COLOR_OPACITY),
      borderRadius: '6px',
      clipPath,
    };

    const newStartTime = format(getDateFromMinutesSinceMidnight(activityStartMins), 'HH:mm');

    const topEnvelopeWing =
      envelopeStartY < previewTileTop
        ? {
            top: envelopeStartY,
            left: previewTileLeft,
            height: previewTileTop - envelopeStartY + 4,
            border: `2px solid ${googleColors[targetActivity.color].contrastColor}`,
          }
        : undefined;

    const bottomEnvelopeWing =
      envelopeEndY > previewTileTop + previewTileHeight
        ? {
            top: previewTileTop + previewTileHeight - 4,
            left: previewTileLeft,
            height: envelopeEndY - (previewTileTop + previewTileHeight) + 4,
            bottom: envelopeEndY,
            border: `2px solid ${googleColors[targetActivity.color].contrastColor}`,
          }
        : undefined;

    return {
      name: targetActivity.name,
      actionsPresent: targetActivity.actions.length > 0,
      styles,
      newStartTime,
      timeOffset: planEndMinsSinceMidnight - activityStartMins,
      topEnvelopeWing,
      bottomEnvelopeWing,
      resourceLane: dropArea.resourceLane(),
    };
  }
}
