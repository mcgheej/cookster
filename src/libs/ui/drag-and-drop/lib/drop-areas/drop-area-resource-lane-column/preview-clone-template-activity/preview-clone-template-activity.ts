import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponentProps } from '../../preview-component-base';
import { DragTemplateActivity } from '../../../drag-operations/operations/drag-template-activity';
import { DropAreaResourceLaneColumn } from '../drop-area-resource-lane-column';

@Component({
  selector: 'ck-preview-clone-template-activity',
  imports: [MatIconModule],
  templateUrl: './preview-clone-template-activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCloneTemplateActivity {
  previewProps = input.required<PreviewComponentProps>();

  private getVM(previewProps: PreviewComponentProps) {
    // Pull out commonly used values from previewProps and check essential data present for drop area
    const { pointerPos, dragOp: baseDragOp, dropArea: baseDropArea, clipArea } = previewProps;
    const dropAreaEl = baseDropArea?.hostElement;
    const dragOp = baseDragOp as DragTemplateActivity;
    const plan = dragOp.plan;
    if (!baseDropArea || !baseDropArea.hostElement || !dropAreaEl || !plan) {
      return undefined;
    }

    const { offsetPosition: offsetPos } = pointerPos;
    const dropArea = baseDropArea as DropAreaResourceLaneColumn;
    const pixelsPerHour = dropArea.pixelsPerHour();
    const timeSnapMins = dropArea.timeSnapMins();
    const timeWindow = dropArea.timeWindow();
  }
}
