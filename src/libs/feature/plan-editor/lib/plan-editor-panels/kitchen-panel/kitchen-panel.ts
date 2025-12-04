
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';

@Component({
  selector: 'ck-kitchen-panel',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './kitchen-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenPanel {
  private readonly planEditorDataService = inject(PlanEditorDataService);

  // protected readonly laneControls = this.planEditorDataService.laneControls;
  protected readonly laneController = this.planEditorDataService.laneController;
  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected toggleLane(index: number): void {
    const lanes = [...this.laneController().laneControls];
    if (index >= 1 && index < lanes.length) {
      lanes[index] = { ...lanes[index], visible: !lanes[index].visible };
      this.laneController.set({ ...this.laneController(), flagsInitialised: true, laneControls: lanes });
    }
  }
}
