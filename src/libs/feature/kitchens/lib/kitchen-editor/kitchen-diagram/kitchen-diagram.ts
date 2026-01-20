import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TfxResizeEvent, TfxResizeObserver } from '@ui/tfx-resize-observer/index';
import { HobContainer } from './hob-container/hob-container';

const sizePercentage = 80;
const aspectRatio = 0.5; // Height = Width * aspectRatio

@Component({
  selector: 'ck-kitchen-diagram',
  imports: [HobContainer, TfxResizeObserver],
  templateUrl: './kitchen-diagram.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenDiagram {
  protected readonly containerWidth = signal(0);
  protected readonly containerHeight = signal(0);

  protected readonly hobContainerSizePx = computed(() => {
    const containerWidth = this.containerWidth();
    const containerHeight = this.containerHeight();
    const hobContainerHeight = Math.round(containerWidth * aspectRatio);
    if (hobContainerHeight <= containerHeight) {
      return {
        width: `${containerWidth}px`,
        height: `${hobContainerHeight}px`,
      };
    } else {
      const hobContainerWidth = Math.round(containerHeight / aspectRatio);
      return {
        width: `${hobContainerWidth}px`,
        height: `${containerHeight}px`,
      };
    }
  });

  onResize(ev: TfxResizeEvent) {
    this.containerWidth.set(Math.round(ev.newRect.width * (sizePercentage / 100)));
    this.containerHeight.set(Math.round(ev.newRect.height * (sizePercentage / 100)));
  }
}
