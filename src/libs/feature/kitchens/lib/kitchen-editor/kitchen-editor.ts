import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KitchenDiagram } from './kitchen-diagram/kitchen-diagram';
import { ResourcePallete } from './resource-pallete/resource-pallete';

@Component({
  selector: 'ck-kitchen-editor',
  imports: [KitchenDiagram, ResourcePallete],
  templateUrl: './kitchen-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenEditor {}
