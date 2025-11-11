import { signal, Type } from '@angular/core';
import { DropArea } from '../../drop-areas/drop-area';
import { DragData, DragEndProps, DragMoveProps, DragOperation, DragStartProps } from '../drag-operation';
import { PreviewComponentBase, PreviewComponentProps } from '../../drop-areas/preview-component-base';
import { PreviewNoDrop } from '../../drop-areas/preview-no-drop';

export interface DragNewResourceActionData extends DragData {}

export class DragNewResourceAction extends DragOperation implements DragNewResourceActionData {
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

  constructor(configData: DragNewResourceActionData) {
    super(configData as DragData);
  }

  start(props: DragStartProps): void {
    const { pointerPos, associatedDropAreas, overlayService, dragOperation, renderer } = props;
    this.associatedDropAreas = associatedDropAreas;

    for (let i = 0; i < this.associatedDropAreas.length; i++) {
      const { previewComponent: preview, clipArea } = this.associatedDropAreas[i].check({
        dragId: dragOperation.id,
        pointerPos,
      });
      if (preview) {
        this.lastDropArea = this.associatedDropAreas[i];
        this.previewComponent = preview;
        this.clipArea = clipArea;
        break;
      }
    }

    this.previewProps.set({ pointerPos, dropArea: this.lastDropArea, dragOp: this, clipArea: this.clipArea });
    overlayService.attachComponent(this.previewComponent, renderer, this.previewProps);
  }

  move(props: DragMoveProps): void {
    const { pointerPos, overlayService, dragOperation, renderer } = props;

    if (this.lastDropArea) {
      const { previewComponent: preview } = this.lastDropArea.check({ dragId: dragOperation.id, pointerPos });
      if (preview) {
        this.previewProps.set({ pointerPos, dropArea: this.lastDropArea, dragOp: this, clipArea: this.clipArea });
        return;
      }
    }

    overlayService.detachComponent(renderer);
    const lastDropAreaId = this.lastDropArea ? this.lastDropArea.id : '';
    this.lastDropArea = null as DropArea | null;
    this.previewComponent = PreviewNoDrop;
    this.clipArea = undefined as DOMRect | undefined;
    for (let i = 0; i < this.associatedDropAreas.length; i++) {
      if (this.associatedDropAreas[i].id === lastDropAreaId) {
        continue;
      }
      const { previewComponent: preview, clipArea } = this.associatedDropAreas[i].check({
        dragId: dragOperation.id,
        pointerPos,
      });
      if (preview) {
        this.lastDropArea = this.associatedDropAreas[i];
        this.previewComponent = preview;
        this.clipArea = clipArea;
        break;
      }
    }

    this.previewProps.set({ pointerPos, dropArea: this.lastDropArea, dragOp: this, clipArea: this.clipArea });
    overlayService.attachComponent(this.previewComponent, renderer, this.previewProps);
  }

  end(props: DragEndProps): void {
    props.overlayService.detachComponent(props.renderer);
    this.associatedDropAreas = [];
    this.lastDropArea = null;
    this.previewComponent = PreviewNoDrop;
  }
}
