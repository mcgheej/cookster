import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { TemplatesDataService } from '@data-access/templates/index';
import { openActivityTemplateDialog } from '@ui/activity-template-dialog/index';
import { DeleteActivitySnack } from '@ui/snack-bars/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { ActivityDB, ActivityTemplateDB } from '@util/data-types/index';

@Injectable()
export class TemplatesPanelService {
  private readonly dialog = inject(MatDialog);
  private readonly templatesData = inject(TemplatesDataService);
  private readonly plansData = inject(PlansDataService);
  private readonly snackBar = inject(MatSnackBar);

  createActivityFromTemplate(newActivity: ActivityDB): void {
    this.plansData.createActivity(newActivity).subscribe({
      error: (error) => {
        this.snackBar.open(`Error creating activity: ${error.message}`, 'Close', {
          duration: DEFAULT_SNACKBAR_DURATION,
        });
      },
    });
  }

  editTemplate(template: ActivityTemplateDB): void {
    const dialogRef = openActivityTemplateDialog(template, this.dialog);
    dialogRef.afterClosed().subscribe((updatedTemplate) => {
      if (updatedTemplate) {
        const { id, ...updates } = updatedTemplate;
        this.templatesData.updateTemplateActivity(id, updates).subscribe({
          error: (error) => {
            this.snackBar.open(`Error updating template: ${error.message}`, 'Close', {
              duration: DEFAULT_SNACKBAR_DURATION,
            });
          },
        });
      }
    });
  }

  deleteTemplate(template: ActivityTemplateDB): void {
    this.snackBar
      .openFromComponent(DeleteActivitySnack, {
        duration: 0,
        verticalPosition: 'bottom',
        data: `Delete template "${template.name}"`,
      })
      .onAction()
      .subscribe(() => {
        this.doDeleteTemplate(template);
      });
  }

  private doDeleteTemplate(template: ActivityTemplateDB): void {
    this.templatesData.deleteActivityTemplate(template.id).subscribe({
      error: (error) => {
        this.snackBar.open(`Error deleting template: ${error.message}`, 'Close', {
          duration: DEFAULT_SNACKBAR_DURATION,
        });
      },
    });
  }
}
