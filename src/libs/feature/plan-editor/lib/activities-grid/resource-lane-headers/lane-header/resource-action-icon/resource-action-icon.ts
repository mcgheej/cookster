import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CkDrag, DragNewResourceAction, DragNewResourceActionData } from '@ui/drag-and-drop/index';
import { DragResult } from '@ui/drag-and-drop/lib/drag-operations/drag-operation';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { ResourceLane } from '@util/data-types/index';

@Component({
  selector: 'ck-resource-action-icon',
  host: { class: 'grid grid-cols-[minmax(0,_1fr)]' },
  imports: [MatIconModule, MatTooltipModule, CkDrag],
  templateUrl: './resource-action-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceActionIcon {
  resourceLane = input.required<ResourceLane>();

  protected dragOperation = computed(() => {
    const id = `drag-new-resource-action-lane-${this.resourceLane().kitchenResource.index}`;
    return new DragNewResourceAction({ id, lockAxis: 'y' } as DragNewResourceActionData);
  });

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  onDragEnd(dragResult: DragResult | undefined): void {
    console.log(dragResult);
  }
}
