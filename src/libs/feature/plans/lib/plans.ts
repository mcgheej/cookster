import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlansService } from './plans-service';
import { CommonModule } from '@angular/common';
import { PlansList } from './plans-list';

@Component({
  selector: 'ck-plans',
  imports: [CommonModule, PlansList],
  template: `
    <div class="size-full overflow-auto">
      <div class="py-4 mx-auto w-3xl grid grid-rows-[auto_minmax(0,1fr)]">
        @if (service.planSummaries$ | async; as planSummaries) {
          <ck-plans-list
            [planSummaries]="planSummaries"
            (addPlan)="service.addPlan()"
            (openPlanEditor)="service.openPlanEditor($event)"
            (editPlanProperties)="service.editPlanProperties($event)"
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
