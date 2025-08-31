import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlansDataService } from '@data-access/plans/lib/plans-data';
import { PlanPropertiesDialog } from '@ui/dialog-plan-properties/lib/plan-properties-dialog';
import { DEFAULT_PLAN_COLOR, DEFAULT_TOOLTIP_SHOW_DELAY, googleColors } from '@util/app-config/index';
import { format } from 'date-fns';

@Component({
  selector: 'ck-plan-panel',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './plan-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPanel {
  private readonly dialog = inject(MatDialog);
  private readonly plansData = inject(PlansDataService);

  protected readonly plan = toSignal(this.plansData.currentPlan$, { initialValue: null });

  /**
   * Computes the color of the plan based on its color property. This is a color name, held as
   * a string, which is used as a key to access the hex color value from the googleColors object.
   */
  protected readonly planColor = computed(() => {
    const plan = this.plan();
    return plan ? googleColors[plan.properties.color].color : googleColors[DEFAULT_PLAN_COLOR].color;
  });

  protected format = format;
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected editPlan() {
    console.log('Edit plan clicked');
    const plan = this.plan();
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
