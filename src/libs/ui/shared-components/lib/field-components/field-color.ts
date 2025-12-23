import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { defaultGoogleColor, DIALOG_COLOR_OPACITY, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';

@Component({
  selector: 'ck-field-color',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './field-color.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldColor implements OnInit {
  form = input.required<FormGroup>();
  controlName = input.required<string>();
  controlLabel = input.required<string>();
  defaultColor = input.required<string>();

  readonly googleColorsArray = Object.entries(googleColors).map(([key, value]) => ({
    name: value.name,
    color: opaqueColor(value.color, DIALOG_COLOR_OPACITY),
  }));

  selected = defaultGoogleColor;

  ngOnInit(): void {
    this.selected = this.form().get(this.controlName())?.value ?? this.defaultColor();
    this.form().controls[this.controlName()].valueChanges.subscribe((value: string | null) => {
      this.selected = value ?? googleColors[this.defaultColor()].name.toLocaleLowerCase();
    });
  }

  protected getSelectedColor(): string {
    return opaqueColor(googleColors[this.selected].color, DIALOG_COLOR_OPACITY);
  }
}
