import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KitchenResourceDB } from '@util/data-types/index';
import { KitchenResourceDialog, KitchenResourceDialogResult } from './kitchen-resource-dialog';

export function openKitchenResourceDialog(
  resource: KitchenResourceDB,
  resourceCount: number,
  dialog: MatDialog
): MatDialogRef<KitchenResourceDialog, KitchenResourceDialogResult> {
  return dialog.open(KitchenResourceDialog, {
    width: '600px',
    maxHeight: '100vh',
    height: '500px',
    data: { resourceCount, resource },
  });
}
