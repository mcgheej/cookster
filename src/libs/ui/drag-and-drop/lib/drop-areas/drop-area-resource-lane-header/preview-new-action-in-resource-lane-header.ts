import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from '../preview-component-base';
import { MatIconModule } from '@angular/material/icon';
import { rectIntersection } from '@util/misc-utilities/index';

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

  private getClipPath(clipArea: DOMRect | undefined, actionIconRect: DOMRect): string {
    if (clipArea) {
      const clippedRect = rectIntersection(clipArea, actionIconRect);
      if (clippedRect) {
        const top = Math.abs(clippedRect.top - actionIconRect.top);
        const right = Math.abs(clippedRect.right - actionIconRect.right);
        const bottom = Math.abs(clippedRect.bottom - actionIconRect.bottom);
        const left = Math.abs(clippedRect.left - actionIconRect.left);
        return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      }
    }
    return 'none';
  }
}
