import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { MatIconModule } from '@angular/material/icon';
import { subPoints } from '@util/data-types/index';

@Component({
  selector: 'ck-preview-new-action-in-resource-header',
  imports: [MatIconModule],
  template: ` <div class="fixed size-[16px]" [style.top.px]="offsetPosition().y" [style.left.px]="offsetPosition().x">
    <mat-icon class="primary-color" [style.fontSize.px]="16" [style.height.px]="16" [style.width.px]="16"
      >electric_bolt</mat-icon
    >
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewNewActionInResourceHeader extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  offsetPosition = computed(() => {
    // const { dragPosition, offsetPosition } = this.previewProps().pointerPos;
    // console.log('pointerPos', this.previewProps().pointerPos);
    // return subPoints(offsetPosition, { x: 0, y: 0 });
    return this.previewProps().pointerPos.offsetPosition;
  });
}
