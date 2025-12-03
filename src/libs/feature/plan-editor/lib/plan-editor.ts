import { ChangeDetectionStrategy, Component, computed, inject, input, OnChanges, OnDestroy } from '@angular/core';
import { MultiPanel } from '@ui/multi-panel/index';
import { MatDividerModule } from '@angular/material/divider';
import { SpeechService } from '@ui/text-speech/index';
import { StatusBar } from '@ui/status-bar/index';
import { ActivitiesGrid } from './activities-grid/activities-grid';
import { PlanEditorDataService } from './plan-editor-data-service';
import { PlanEditorService } from './plan-editor-service';
import { SELECTED_ACTIVITY_PANEL_NAME, selectorButtons } from './types-constants/selector-buttons';
import { openTimeSnapDialog } from '@ui/dialog-time-snap/index';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ck-plan-editor',
  imports: [MatDividerModule, MultiPanel, ActivitiesGrid, StatusBar],
  templateUrl: './plan-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlanEditorService, PlanEditorDataService],
})
export class PlanEditor implements OnChanges, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly planEditorDataService = inject(PlanEditorDataService);
  private readonly planEditorService = inject(PlanEditorService);
  private readonly textSpeech = inject(SpeechService);

  readonly planId = input.required<string>();

  protected readonly selectorButtons = selectorButtons;
  protected readonly currentPlan = this.planEditorDataService.currentPlan;
  protected readonly activities = this.planEditorDataService.activities;
  protected readonly timeSnap = this.planEditorDataService.timeSnapMins;

  protected readonly openPanel = computed(() => {
    return this.planEditorDataService.selectedActivityId() ? SELECTED_ACTIVITY_PANEL_NAME : '';
  });

  ngOnChanges() {
    this.planEditorService.setPlanId(this.planId());
  }

  ngOnDestroy() {
    this.planEditorService.setPlanId('');
  }

  protected openTimeSnapDialog() {
    const dialogRef = openTimeSnapDialog(this.planEditorDataService.timeSnapMins(), this.dialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.planEditorDataService.setTimeSnapMins(result);
      }
    });
  }
}
