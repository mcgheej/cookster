import { ChangeDetectionStrategy, Component } from '@angular/core';
import { matColorsData } from './mat-colors-data';

@Component({
  selector: 'ck-mat-colors',
  imports: [],
  templateUrl: './mat-colors.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatColors {
  protected matColorsData = matColorsData;
}
