import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplatesDataService } from '@data-access/templates/index';
import { DeleteActivitySnack } from '@ui/snack-bars/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { ActivityTemplateDB } from '@util/data-types/index';

@Injectable()
export class TemplatesPanelService {
  private readonly templatesData = inject(TemplatesDataService);
  private readonly snackBar = inject(MatSnackBar);

  deleteTemplate(template: ActivityTemplateDB) {
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

  private doDeleteTemplate(template: ActivityTemplateDB) {
    this.templatesData.deleteActivityTemplate(template.id).subscribe({
      error: (error) => {
        this.snackBar.open(`Error deleting template: ${error.message}`, 'Close', {
          duration: DEFAULT_SNACKBAR_DURATION,
        });
      },
    });
  }
}
