import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimeSnapDialog } from './time-snap-dialog';

export function openTimeSnapDialog(timeSnapMins: number, dialog: MatDialog): MatDialogRef<TimeSnapDialog, number> {
  return dialog.open(TimeSnapDialog, {
    width: '350px',
    data: timeSnapMins,
  });
}
