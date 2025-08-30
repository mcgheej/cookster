import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/lib/plans-data';

@Component({
  selector: 'ck-plan-panel',
  imports: [CommonModule],
  template: `
    <h2>Plan</h2>
    <p>{{ plan() | json }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPanel {
  private readonly plansData = inject(PlansDataService);

  protected readonly plan = toSignal(this.plansData.currentPlan$, { initialValue: null });
}
