import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FIELD_KITCHEN, PlanPropertiesFormService } from './plan-properties-form-service.ts';
import { map } from 'rxjs';
import { AfKitchensService } from '@data-access/kitchens/index.js';
import { Kitchen } from '@util/data-types/lib/kitchen.js';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'ck-field-kitchen',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  template: `
    <div class="grid grid-cols-[1fr_1fr] gap-4" [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Kitchen</mat-label>
        <mat-select [formControlName]="controlName" [(value)]="selected" panelWidth="">
          <mat-select-trigger>{{ selected?.name }}</mat-select-trigger>
          @for (kitchen of kitchens$ | async; track kitchen.id) {
            <mat-option [value]="kitchen">{{ kitchen.name }}</mat-option>
          }
        </mat-select>
        @if (form.get(controlName)?.invalid && form.get(controlName)?.touched) {
          <mat-error>Kitchen must be selected</mat-error>
        }
        @if (form.get(controlName)?.invalid && !form.get(controlName)?.touched) {
          <mat-hint>Select a kitchen</mat-hint>
        }
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldKitchen {
  protected readonly form = inject(PlanPropertiesFormService).form;
  protected readonly kitchens$ = inject(AfKitchensService).kitchens$.pipe(
    map((kitchens) => [...kitchens].map(([id, kitchen]) => kitchen))
  );
  protected readonly controlName = FIELD_KITCHEN;
  protected selected: Kitchen | null = null;
}
