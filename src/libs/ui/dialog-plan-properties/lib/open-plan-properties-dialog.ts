import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlanProperties } from '@util/data-types/index';
import { PlanPropertiesDialog } from './plan-properties-dialog';

export function openPlanPropertiesDialog(
  data: PlanProperties,
  dialog: MatDialog
): MatDialogRef<PlanPropertiesDialog, Partial<PlanProperties>> {
  return dialog.open(PlanPropertiesDialog, {
    width: '600px',
    maxWidth: '800px',
    maxHeight: '100vh',
    height: data.id ? '525px' : '600px',
    data,
  });
}
