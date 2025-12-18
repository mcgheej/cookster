import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResourceActionDialog, ResourceActionDialogData, ResourceActionDialogResult } from './resource-action-dialog';

export function openResourceActionDialog(
  data: ResourceActionDialogData,
  dialog: MatDialog
): MatDialogRef<ResourceActionDialog, ResourceActionDialogResult> {
  return dialog.open(ResourceActionDialog, {
    width: '400px',
    maxHeight: '100vh',
    height: '325px',
    data,
  });
}
