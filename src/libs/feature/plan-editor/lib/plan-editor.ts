import { ChangeDetectionStrategy, Component, inject, input, OnChanges } from '@angular/core';
import { MultiPanel } from '@ui/multi-panel/index';
import { MatDividerModule } from '@angular/material/divider';
import { SpeechService } from '@ui/text-speech/index';
import { StatusBar } from '@ui/status-bar/index';
import { ActivitiesGrid } from './activities-grid/activities-grid';
import { PlanEditorDataService } from './plan-editor-data-service';
import { PlanEditorService } from './plan-editor-service';
import { selectorButtons } from './types-constants/selector-buttons';

@Component({
  selector: 'ck-plan-editor',
  imports: [MatDividerModule, MultiPanel, ActivitiesGrid, StatusBar],
  templateUrl: './plan-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlanEditorService, PlanEditorDataService],
})
export class PlanEditor implements OnChanges {
  private readonly planEditorDataService = inject(PlanEditorDataService);
  private readonly planEditorService = inject(PlanEditorService);
  private readonly textSpeech = inject(SpeechService);

  readonly planId = input.required<string>();

  protected readonly selectorButtons = selectorButtons;
  protected readonly currentPlan = this.planEditorDataService.currentPlan;
  protected readonly activities = this.planEditorDataService.activities;
  protected readonly flags = this.planEditorDataService.laneControls;

  ngOnChanges() {
    this.planEditorService.setPlanId(this.planId());
  }
}
