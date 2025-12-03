import { ActivityDB, DisplayTile, Plan, ResourceLane } from '@util/data-types/index';
import { DragData, DragEndProps, DragMoveProps, DragOperation, DragResult, DragStartProps } from '../drag-operation';
import { DropArea } from '../../drop-areas/drop-area';
import { signal, Type } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../../drop-areas/preview-component-base';
import { PreviewNoDrop } from '../../drop-areas/preview-no-drop';
import { PointerData } from '../../types/pointer-data';
import { PreviewMoveActivity } from '../../drop-areas/drop-area-resource-lane-column/preview-move-activity/preview-move-activity';

export interface DragActivityData extends DragData {
  plan: Plan | null;
  activity: ActivityDB;
}

export interface DragActivityResult extends DragResult {
  timeOffset: number;
  resourceLane: ResourceLane;
}

export class DragActivity extends DragOperation implements DragActivityData {
  plan: Plan | null;
  activity: ActivityDB;

  /**
   * The drop areas associated with this drag operation. Initialised on drag start and cleared on drag end.
   */
  private associatedDropAreas: DropArea[] = [];

  /**
   * The preview component provides feedback to the user relating to the current drag
   * operation. When the dragPosition is over an accepted drop area, the preview component
   * is set to a value determined by the drop area. When the dragPosition is not over an accepted
   * drop area, the preview component is set to PreviewNoDrop.
   */
  private previewComponent: Type<PreviewComponentBase> = PreviewNoDrop;
  private clipArea: DOMRect | undefined = undefined;

  /**
   * The last drop area that the pointer was over during the drag operation. If the last
   * dragPosition was not over any drop area, this value is null.
   */
  private lastDropArea: DropArea | null = null;

  private previewProps = signal<PreviewComponentProps>({} as PreviewComponentProps);

  constructor(configData: DragActivityData) {
    super(configData as DragData);
    this.plan = configData.plan;
    this.activity = configData.activity;
  }

  start(props: DragStartProps): void {
    const { pointerPos, associatedDropAreas, overlayService, renderer } = props;
    this.associatedDropAreas = associatedDropAreas;

    this.setupDropArea(pointerPos);

    this.previewProps.set({ pointerPos, dropArea: this.lastDropArea, dragOp: this, clipArea: this.clipArea });
    overlayService.attachComponent(this.previewComponent, renderer, this.previewProps);
  }

  move(props: DragMoveProps): void {
    const { pointerPos, overlayService, renderer } = props;

    const setupResult = this.setupDropArea(pointerPos);
    if (setupResult === 'changed') {
      overlayService.detachComponent(renderer);
      this.previewProps.set({ pointerPos, dropArea: this.lastDropArea, dragOp: this, clipArea: this.clipArea });
      overlayService.attachComponent(this.previewComponent, renderer, this.previewProps);
    } else {
      this.previewProps.set({ pointerPos, dropArea: this.lastDropArea, dragOp: this, clipArea: this.clipArea });
    }
  }

  end(props: DragEndProps): DragActivityResult | undefined {
    this.setupDropArea(props.pointerPos);

    let result: DragActivityResult | undefined = undefined;
    if (this.lastDropArea && this.plan) {
      if (this.previewComponent === PreviewMoveActivity) {
        result = (props.overlayService.attachedComponentRef?.instance as PreviewMoveActivity).activityPosition;
      }
    }

    props.overlayService.detachComponent(props.renderer);
    this.associatedDropAreas = [];
    this.lastDropArea = null;
    this.previewComponent = PreviewNoDrop;
    return result;
  }

  private setupDropArea(pointerPos: PointerData): 'same' | 'changed' {
    // If the last mouse position was over a drop area, check if we are still over it
    if (this.lastDropArea) {
      const { previewComponent: preview, clipArea } = this.lastDropArea.check({ dragId: this.id, pointerPos });
      if (preview) {
        return 'same';
      }
    }

    const lastDropAreaId = this.lastDropArea ? this.lastDropArea.id : '';
    this.lastDropArea = null as DropArea | null;
    this.previewComponent = PreviewNoDrop;
    this.clipArea = undefined as DOMRect | undefined;
    for (let i = 0; i < this.associatedDropAreas.length; i++) {
      if (this.associatedDropAreas[i].id === lastDropAreaId) {
        continue;
      }
      const { previewComponent: preview, clipArea } = this.associatedDropAreas[i].check({
        dragId: this.id,
        pointerPos,
      });
      if (preview) {
        this.lastDropArea = this.associatedDropAreas[i];
        this.previewComponent = preview;
        this.clipArea = clipArea;
        break;
      }
    }
    const newDropAreaId = this.lastDropArea ? this.lastDropArea.id : '';
    return newDropAreaId !== lastDropAreaId ? 'changed' : 'same';
  }
}
