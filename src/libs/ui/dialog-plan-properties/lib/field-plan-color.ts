import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { googleColors } from '@util/app-config/index';
import { DEFAULT_PLAN_COLOR, DIALOG_COLOR_OPACITY } from '@util/app-config/index';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { opaqueColor } from '@util/color-utilities/index';
import { FIELD_PLAN_COLOR, PlanPropertiesFormService } from './plan-properties-form-service';

@Component({
  selector: 'ck-plan-field-color',
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
              [style.color]="getSelectedColor()"
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
export class FieldPlanColor {
  protected readonly form = inject(PlanPropertiesFormService).form;

  protected readonly controlName = FIELD_PLAN_COLOR;
  // readonly googleColors = googleColors;
  readonly googleColorsArray = Object.entries(googleColors).map(([key, value]) => ({
    name: value.name,
    color: opaqueColor(value.color, DIALOG_COLOR_OPACITY),
  }));

  selected = DEFAULT_PLAN_COLOR;

  constructor() {
    this.form.get(FIELD_PLAN_COLOR)?.valueChanges.subscribe((value) => {
      this.selected = value ?? googleColors[DEFAULT_PLAN_COLOR].name.toLocaleLowerCase();
    });
  }

  protected getSelectedColor(): string {
    return opaqueColor(googleColors[this.selected].color, DIALOG_COLOR_OPACITY);
  }
}
