import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplatesDataService } from '@data-access/templates/index';
import { openActivityTemplateDialog } from '@ui/activity-template-dialog/index';
import { DeleteActivitySnack } from '@ui/snack-bars/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { ActivityTemplateDB } from '@util/data-types/index';

@Injectable()
export class TemplatesPanelService {
  private readonly dialog = inject(MatDialog);
  private readonly templatesData = inject(TemplatesDataService);
  private readonly snackBar = inject(MatSnackBar);

  editTemplate(template: ActivityTemplateDB): void {
    const dialogRef = openActivityTemplateDialog(template, this.dialog);
    dialogRef.afterClosed().subscribe((updatedTemplate) => {
      if (updatedTemplate) {
        // update the template
        console.log('updated template', updatedTemplate);
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
