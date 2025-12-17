import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { openResourceActionDialog } from '@ui/dialog-resource-action/index';
import { CkDrag, DragMoveResourceAction, DragMoveResourceActionResult, DragResult } from '@ui/drag-and-drop/index';
import { RESOURCE_ACTION_COMPONENT_HEIGHT } from '@util/app-config/index';
import { ActionDisplayTile, Plan, ResourceAction, ResourceLane } from '@util/data-types/index';

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
  private readonly dialog = inject(MatDialog);

  resourceLane = input.required<ResourceLane>();
  plan = input.required<Plan | null>();
  tile = input.required<ActionDisplayTile>();

  deleteResourceAction = output<void>();
  updateResourceActionTime = output<Date>();
  updateResourceAction = output<ResourceAction>();

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

  onEditAction(ev: Event): void {
    ev.stopPropagation();
    ev.preventDefault();
    const plan = this.plan();
    if (plan) {
      const dialogRef = openResourceActionDialog({ plan, resourceAction: this.tile().resourceAction }, this.dialog);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.operation === 'save') {
            this.updateResourceAction.emit(result.action);
          } else if (result.operation === 'delete') {
            this.deleteResourceAction.emit();
          }
        }
      });
    }
  }

  onDragStart(): void {
    this.showElement.set('hidden');
  }

  onDragEnd(ev: DragResult | undefined): void {
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
