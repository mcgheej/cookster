import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FIELD_COLOR, PlanPropertiesFormService } from './plan-properties-form-service.ts';
import { googleColors } from '@util/app-config/lib/google-colors';
import { DEFAULT_PLAN_COLOR } from '@util/app-config/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ck-field-color',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  template: `
    <div class="grid grid-cols-[1fr]" [formGroup]="form">
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

          @for (color of googleColorsArray; track color) {
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
export class FieldColor {
  protected readonly form = inject(PlanPropertiesFormService).form;

  protected readonly controlName = FIELD_COLOR;
  readonly googleColors = googleColors;
  readonly googleColorsArray = Object.entries(googleColors).map(([key, value]) => ({
    name: value.name,
    color: value.color,
  }));

  selected = DEFAULT_PLAN_COLOR;

  constructor() {
    this.form.get(FIELD_COLOR)?.valueChanges.subscribe((value) => {
      this.selected = value ?? googleColors[DEFAULT_PLAN_COLOR].name.toLocaleLowerCase();
    });
  }
}
