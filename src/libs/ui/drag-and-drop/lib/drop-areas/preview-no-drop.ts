import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { subPoints } from '@util/data-types/index';
import { PreviewComponentBase, PreviewComponentProps } from './preview-component-base';

@Component({
  selector: 'ck-preview-no-drop',
  imports: [MatIconModule],
  template: ` <div
    class="fixed size-[32px]"
    [style.top.px]="adjustedPosition().y"
    [style.left.px]="adjustedPosition().x">
    <mat-icon class="error-color" [style.fontSize.px]="32" [style.height.px]="32" [style.width.px]="32">block</mat-icon>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewNoDrop extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  adjustedPosition = computed(() => {
    const { dragPosition } = this.previewProps().pointerPos;
    return subPoints(dragPosition, { x: 20, y: 20 });
  });
}
