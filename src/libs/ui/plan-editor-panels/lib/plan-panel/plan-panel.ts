import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlansDataService } from '@data-access/plans/lib/plans-data';
import { DEFAULT_PLAN_COLOR, DEFAULT_TOOLTIP_SHOW_DELAY, googleColors } from '@util/app-config/index';
import { format } from 'date-fns';

@Component({
  selector: 'ck-plan-panel',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './plan-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPanel {
  private readonly plansData = inject(PlansDataService);

  protected readonly plan = toSignal(this.plansData.currentPlan$, { initialValue: null });

  protected readonly planColor = computed(() => {
    const plan = this.plan();
    return plan ? googleColors[plan.properties.color].color : googleColors[DEFAULT_PLAN_COLOR].color;
  });

  protected format = format;
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected editPlan() {
    console.log('Edit plan clicked');
  }
}
