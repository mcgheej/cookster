import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlansService } from './plans-service';
import { CommonModule } from '@angular/common';
import { PlansList } from './plans-list';

@Component({
  selector: 'ck-plans',
  imports: [CommonModule, PlansList],
  template: `
    <div class="size-full overflow-auto">
      <div class="py-4 mx-auto w-[768px] grid grid-rows-[auto_minmax(0,_1fr)]">
        @if (service.planSummaries$ | async; as planSummaries) {
          <ck-plans-list
            [planSummaries]="planSummaries"
            (addPlan)="service.addPlan()"
            (editPlan)="service.editPlan($event)"
            (copyPlan)="service.copyPlan($event)"
            (deletePlan)="service.deletePlan($event)"
            (runAlarms)="service.runAlarms($event)"></ck-plans-list>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlansService],
})
export class Plans {
  protected readonly service = inject(PlansService);
}
