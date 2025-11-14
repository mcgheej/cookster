import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ck-preview-new-action-in-resource-header',
  imports: [MatIconModule],
  template: ` <div
    class="fixed size-[16px]"
    [style.top.px]="vm().offsetPosition.y"
    [style.left.px]="vm().offsetPosition.x"
    [style.clipPath]="vm().clipPath">
    <mat-icon class="primary-color" [style.fontSize.px]="16" [style.height.px]="16" [style.width.px]="16"
      >electric_bolt</mat-icon
    >
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewNewActionInResourceLaneHeader extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const offsetPosition = this.previewProps().pointerPos.offsetPosition;
    const clipPath = this.getClipPath(
      this.previewProps().clipArea,
      DOMRect.fromRect({
        x: offsetPosition.x,
        y: offsetPosition.y,
        width: 16,
        height: 16,
      })
    );
    return {
      offsetPosition,
      clipPath,
    };
  });
}
