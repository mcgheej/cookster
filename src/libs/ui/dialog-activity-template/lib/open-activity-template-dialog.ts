import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivityTemplateDB } from '@util/data-types/index';
import { ActivityTemplateDialog } from './activity-template-dialog';

export function openActivityTemplateDialog(
  template: ActivityTemplateDB,
  dialog: MatDialog
): MatDialogRef<ActivityTemplateDialog, ActivityTemplateDB> {
  return dialog.open(ActivityTemplateDialog, {
    width: '600px',
    maxHeight: '100vh',
    height: '850px',
    data: template,
  });
}
