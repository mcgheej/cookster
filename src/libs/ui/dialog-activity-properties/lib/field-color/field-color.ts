import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityPropertiesFormService, F_COLOR } from '../activity-properties-form-service';
import { defaultGoogleColor, googleColors } from '@util/app-config/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ck-field-color',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './field-color.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldColor {
  readonly form = inject(ActivityPropertiesFormService).form;
  readonly controlName = F_COLOR;

  readonly googleColors = googleColors;
  readonly googleColorsArr = Object.entries(googleColors).map(([key, value]) => ({
    name: value.name,
    color: value.color,
  }));

  selected!: string;

  constructor() {
    this.form.get(F_COLOR)?.valueChanges.subscribe((value) => {
      this.selected = value ?? googleColors[defaultGoogleColor].name.toLocaleLowerCase();
    });
  }
}
