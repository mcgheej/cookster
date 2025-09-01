import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/lib/plans-data';

@Component({
  selector: 'ck-kitchen-panel',
  imports: [CommonModule],
  templateUrl: './kitchen-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenPanel {
  private readonly plansData = inject(PlansDataService);

  protected readonly plan = toSignal(this.plansData.currentPlan$, { initialValue: null });

  protected readonly kitchenResources = computed(() => {
    const plan = this.plan();
    return plan ? plan.properties.kitchenResources : [];
  });
}
