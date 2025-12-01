import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivityTemplateFormService } from '../activity-template-form-service';
import { DEFAULT_COLOR_OPACITY, defaultGoogleColor, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';

@Component({
  selector: 'ck-field-template-color',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  template: `
    <div [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Colour</mat-label>
        <mat-select [formControlName]="controlName" panelWidth="">
          <mat-select-trigger>
            <mat-icon
              [style.fontSize.px]="16"
              [style.height.px]="16"
              class="relative top-[3px]"
              [style.color]="googleColors[selected].color"
              >circle</mat-icon
            >
            <span>{{ selected }}</span>
          </mat-select-trigger>

          @for (color of googleColorsArr; track color) {
            <mat-option [value]="color.name.toLocaleLowerCase()">
              <mat-icon [style.color]="color.color">circle</mat-icon>{{ color.name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTemplateColor {
  readonly formService = inject(ActivityTemplateFormService);
  readonly form = this.formService.form;
  readonly controlName = 'color';

  readonly googleColors = googleColors;
  readonly googleColorsArr = Object.entries(googleColors).map(([key, value]) => ({
    name: value.name,
    color: opaqueColor(value.color, DEFAULT_COLOR_OPACITY),
  }));

  selected!: string;

  constructor() {
    this.form.get(this.controlName)?.valueChanges.subscribe((value) => {
      this.selected = value ?? googleColors[defaultGoogleColor].name.toLocaleLowerCase();
    });
  }
}
