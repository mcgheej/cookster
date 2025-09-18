import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanPropertiesDialog } from '@ui/dialog-plan-properties/lib/plan-properties-dialog';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { format } from 'date-fns';
import { PlanEditorDataService } from '../../plan-editor-data-service';

@Component({
  selector: 'ck-plan-panel',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    @if (currentPlan(); as plan) {
      <div class="ml-1">
        <div class="inline-block size-[10px] rounded-[50%]" [style.backgroundColor]="planColor()"></div>
        <div class="inline-block pl-1 pt-2 font-bold text-sm select-none">Plan:</div>
      </div>
      <div class="pl-[18px] text-sm select-none">{{ plan.properties.name }}</div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Date:</div>
      <div class="pl-[18px] text-sm select-none">
        {{ format(plan.properties.endTime, 'EEE, do LLL, yyyy - HH:mm') }}
      </div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Starting at:</div>
      <div class="pl-[18px] text-sm select-none">{{ format(plan.properties.startTime, 'HH:mm') }}</div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Description:</div>
      <div class="ml-[13px] mt-1 border border-gray-300 w-[273px] h-[80px] overflow-auto">
        <div class="pl-1 pr-1 text-sm select-none">{{ plan.properties.description || 'No description' }}</div>
      </div>
      <div class="pt-2 pl-[18px]">
        <button
          matIconButton
          [matTooltipShowDelay]="tooltipShowDelay"
          matTooltip="edit plan properties"
          (click)="editPlan()">
          <mat-icon>edit_attributes</mat-icon>
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPanel {
  private readonly dialog = inject(MatDialog);
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly currentPlan = this.planEditorData.currentPlan;
  protected readonly planColor = this.planEditorData.planColor;

  protected format = format;
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected editPlan() {
    const plan = this.currentPlan();
    if (plan) {
      this.dialog.open(PlanPropertiesDialog, {
        data: plan.properties,
        width: '600px',
        maxWidth: '800px',
        maxHeight: '100vh',
        height: '775px',
      });
    }
  }
}
