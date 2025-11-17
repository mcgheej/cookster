import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { PLAN_END_BAR_HEIGHT } from '@util/app-config/lib/constants';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CkDrag, DragResult } from '@ui/drag-and-drop/index';
import { PlanEndService } from './plan-end-service';

@Component({
  selector: 'ck-plan-end',
  host: {
    '[style.visibility]': 'showElement()',
  },
  imports: [CommonModule, MatIconModule, MatTooltipModule, CkDrag],
  templateUrl: './plan-end.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlanEndService],
})
export class PlanEnd {
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly planEndService = inject(PlanEndService);

  protected readonly dragOperation = this.planEndService.computedDragOperation();
  protected readonly planEndY = this.planEndService.computedPlanEndY();

  protected showElement = signal<'visible' | 'hidden'>('visible');

  protected readonly planEndTethered = this.planEditorData.activitiesGridPlanEndTethered;
  protected readonly activitiesGridWidth = this.planEditorData.activitiesGridWidth;

  protected planEndBarHeight = PLAN_END_BAR_HEIGHT;

  protected setPlanEndTethered(tethered: boolean): void {
    this.planEditorData.setActivitiesGridPlanEndTethered(tethered);
  }

  onDragStarted(): void {
    this.showElement.set('hidden');
  }

  onDragEnded(ev: DragResult | undefined): void {
    if (this.planEndTethered()) {
      this.planEndService.dragTetheredPlanEndEnded(ev);
    } else {
      this.planEndService.dragUntetheredPlanEndEnded(ev);
    }
    this.showElement.set('visible');
  }
}
