import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CkDrag, DragMoveResourceAction, DragMoveResourceActionResult, DragResult } from '@ui/drag-and-drop/index';
import { RESOURCE_ACTION_COMPONENT_HEIGHT } from '@util/app-config/index';
import { ActionDisplayTile, Plan, ResourceLane } from '@util/data-types/index';

@Component({
  selector: 'ck-resource-action-tile',
  host: {
    '[style.visibility]': 'showElement()',
  },
  imports: [MatIconModule, MatTooltipModule, CkDrag],
  templateUrl: './resource-action-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceActionTile {
  resourceLane = input.required<ResourceLane>();
  plan = input.required<Plan | null>();
  tile = input.required<ActionDisplayTile>();

  deleteResourceAction = output<void>();
  updateResourceActionTime = output<Date>();

  protected showElement = signal<'visible' | 'hidden'>('visible');

  protected readonly dragOperation = computed(() => {
    const id = `drag-move-resource-action-lane-${this.resourceLane().kitchenResource.index}`;
    return new DragMoveResourceAction({
      id,
      lockAxis: 'y',
      plan: this.plan(),
      resourceLane: this.resourceLane(),
      resourceAction: this.tile().resourceAction,
    });
  });

  protected readonly componentHeight = RESOURCE_ACTION_COMPONENT_HEIGHT.toString() + 'px';

  onClick(ev: Event): void {
    ev.stopPropagation();
    ev.preventDefault();
    console.log('Resource Action Tile clicked:', this.tile());
  }

  onDragStarted(): void {
    this.showElement.set('hidden');
  }

  onDragEnded(ev: DragResult | undefined): void {
    if (ev) {
      const result = ev as DragMoveResourceActionResult;
      if (result.operation === 'delete') {
        this.deleteResourceAction.emit();
      } else if (result.operation === 'update' && result.time) {
        this.updateResourceActionTime.emit(result.time);
      }
    }
    this.showElement.set('visible');
  }
}
