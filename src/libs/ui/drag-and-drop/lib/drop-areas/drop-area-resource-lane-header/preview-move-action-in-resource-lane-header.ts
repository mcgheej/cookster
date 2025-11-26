import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { DragMoveResourceAction } from '../../drag-operations/operations/drag-move-resource-action';

@Component({
  selector: 'ck-preview-move-action-in-resource-header',
  template: `<div
    class="fixed bg-[var(--mat-sys-error-container)] text-[var(--mat-sys-error-on-error-container)] grid grid-cols-1"
    [style.top.px]="vm().top"
    [style.left.px]="vm().left"
    [style.width.px]="vm().width"
    [style.height.px]="vm().height"
    [style.clipPath]="vm().clipPath">
    <div class="self-center justify-self-center select-none">Delete '{{ vm().name }}'</div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewMoveActionInResourceLaneHeader extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const dragOp = this.previewProps().dragOp as DragMoveResourceAction;
    const dropElement = this.previewProps().dropArea?.hostElement;
    const clipArea = this.previewProps().clipArea;
    if (dropElement) {
      const dropRect = dropElement.getBoundingClientRect();
      return {
        top: dropRect.top,
        left: dropRect.left,
        width: dropRect.width - 2,
        height: dropRect.height - 2,
        name: dragOp.resourceAction.name,
        clipPath: this.getClipPath(clipArea, dropRect),
      };
    }
    const resourceAction = dragOp.resourceAction;
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      name: '',
      clipPath: 'none',
    };
  });
}
