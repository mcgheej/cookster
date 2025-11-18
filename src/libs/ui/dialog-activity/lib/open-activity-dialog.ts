import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivityDB } from '@util/data-types/index';
import { ActivityDialog, ActivityDialogData } from './activity-dialog';

export function openActivityDialog(
  data: ActivityDialogData,
  dialog: MatDialog
): MatDialogRef<ActivityDialog, ActivityDB> {
  return dialog.open(ActivityDialog, {
    width: '600px',
    maxHeight: '100vh',
    height: '850px',
    data,
  });
}
