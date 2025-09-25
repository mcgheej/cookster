import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivityPropertiesDialog, ActivityPropertiesDialogData } from './activity-properties-dialog';
import { ActivityDB } from '@util/data-types/index';

export function openActivityPropertiesDialog(
  data: ActivityPropertiesDialogData,
  dialog: MatDialog
): MatDialogRef<ActivityPropertiesDialog, ActivityDB> {
  return dialog.open(ActivityPropertiesDialog, {
    width: '600px',
    maxHeight: '100vh',
    height: '826px',
    data,
  });
}
