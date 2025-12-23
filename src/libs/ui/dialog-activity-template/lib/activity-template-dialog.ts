import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivityTemplateFormService } from './activity-template-form-service';
import { ActivityTemplateDB } from '@util/data-types/index';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FieldTemplateActions } from './fields/field-template-actions/field-template-actions';
import { FieldColor, FieldError, FieldText, FieldTextarea, FieldTimepicker } from '@ui/shared-components/index';
import { DEFAULT_ACTIVITY_COLOR } from '@util/app-config/index';

@Component({
  selector: 'ck-activity-template-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FieldTemplateActions,
    FieldTimepicker,
    FieldText,
    FieldTextarea,
    FieldColor,
  ],
  templateUrl: './activity-template-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivityTemplateFormService],
})
export class ActivityTemplateDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ActivityTemplateDialog, ActivityTemplateDB>);
  protected readonly formService = inject(ActivityTemplateFormService);
  protected readonly template: ActivityTemplateDB = inject(MAT_DIALOG_DATA);

  protected readonly form = this.formService.form;

  protected readonly nameErrors: FieldError[] = [{ errorName: 'required', errorString: 'Name is required' }] as const;

  protected readonly defaultActivityColor = DEFAULT_ACTIVITY_COLOR;

  // Lifecyle methods
  // ----------------

  ngOnInit(): void {
    this.formService.initialise(this.template);
  }

  // User actions
  // ------------

  saveTemplate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.formService.getTemplateFromForm(this.template));
  }
}
