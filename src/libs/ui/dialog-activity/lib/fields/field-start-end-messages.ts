import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivityFormService } from '../activity-form-service';

@Component({
  selector: 'ck-field-start-end-messages',
  imports: [ReactiveFormsModule, MatInputModule],
  template: `
    <div class="mt-3 grid grid-cols-[1fr_1fr] gap-4" [formGroup]="form">
      <mat-form-field floatLabel="auto">
        <mat-label>Start message</mat-label>
        <input matInput inputType="text" formControlName="startMessage" />
      </mat-form-field>
      <mat-form-field floatLabel="auto">
        <mat-label>End message</mat-label>
        <input matInput inputType="text" formControlName="endMessage" />
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldStartEndMessages {
  readonly form = inject(ActivityFormService).form;
  readonly startMessageName = 'startMessage';
  readonly endMessageName = 'endMessage';
}
