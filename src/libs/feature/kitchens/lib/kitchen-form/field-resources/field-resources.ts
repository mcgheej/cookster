import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { KitchenResourceDB } from '@util/data-types/index';
import { openKitchenResourceDialog } from 'libs/ui/dialog-kitchen-resource';
import { NEW_KITCHEN_RESOURCE_ID } from '../../constants';

@Component({
  selector: 'ck-field-resources',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-resources.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldResources implements FormValueControl<KitchenResourceDB[]> {
  private dialog = inject(MatDialog);

  value = model<KitchenResourceDB[]>([]);
  kitchenId = input<string>('');

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected addResource(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    openKitchenResourceDialog(
      {
        id: '',
        name: '',
        description: '',
        maxParallelActivities: 1,
        seq: this.value().length,
        kitchenId: this.kitchenId(),
      },
      this.dialog
    )
      .afterClosed()
      .subscribe((result) => {
        if (result && result.operation === 'save') {
          this.value.update((resources) => [...resources, { ...result.resource, id: NEW_KITCHEN_RESOURCE_ID }]);
        }
      });
  }

  protected editResource(event: MouseEvent, resourceIndex: number): void {
    event.stopPropagation();
    event.preventDefault();
    openKitchenResourceDialog(this.value()[resourceIndex], this.dialog)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result.operation === 'save') {
            this.value.update((resources) => {
              const updatedResources = [...resources];
              updatedResources[resourceIndex] = result.resource;
              return updatedResources;
            });
          } else if (result.operation === 'delete') {
            this.value.update((resources) => {
              const updatedResources = [...resources];
              updatedResources.splice(resourceIndex, 1);
              for (let i = resourceIndex; i < updatedResources.length; i++) {
                updatedResources[i] = { ...updatedResources[i], seq: i };
              }
              return updatedResources;
            });
          }
        }
      });
  }

  protected getResourceText(resource: KitchenResourceDB): string {
    return resource.name === resource.description || resource.description === ''
      ? resource.name
      : `${resource.name} (${resource.description})`;
  }
}
