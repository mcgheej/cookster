import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DEFAULT_ACTIVITY_COLOR, defaultGoogleColor, DIALOG_COLOR_OPACITY, googleColors } from '@util/app-config/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { opaqueColor } from '@util/color-utilities/index';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-color',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './field-color.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldColor {
  readonly form = inject(ActivityFormService).form;
  readonly controlName = 'color';

  readonly googleColors = googleColors;
  readonly googleColorsArr = Object.entries(googleColors).map(([key, value]) => ({
    name: value.name,
    color: opaqueColor(value.color, DIALOG_COLOR_OPACITY),
  }));

  selected = DEFAULT_ACTIVITY_COLOR;

  constructor() {
    // this.form.get(F_COLOR)?.valueChanges.subscribe((value) => {
    //   this.selected = value ?? googleColors[defaultGoogleColor].name.toLocaleLowerCase();
    // });
    this.form.controls.color.valueChanges.subscribe((value) => {
      this.selected = value;
    });
  }

  protected getSelectedColor(): string {
    return opaqueColor(googleColors[this.selected].color, DIALOG_COLOR_OPACITY);
  }
}
