import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnDestroy } from '@angular/core';
import { PlanOverview } from './plan-overview/plan-overview';
import { PlansDataService } from '@data-access/plans/index';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { AlarmsContainer } from './alarms-container/alarms-container';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alarms-runner',
  imports: [PlanOverview, AlarmsContainer],
  templateUrl: './alarms-runner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsRunner implements OnChanges, OnDestroy {
  private readonly router = inject(Router);
  private readonly plansData = inject(PlansDataService);

  readonly planId = input.required<string>();

  protected readonly currentTime = toSignal(interval(1000).pipe(map(() => new Date())), { initialValue: new Date() });

  ngOnChanges() {
    if (this.planId() !== this.plansData.currentPlanId) {
      this.plansData.currentPlanId = this.planId();
    }
  }

  ngOnDestroy(): void {
    this.plansData.currentPlanId = '';
  }

  protected editPlan(planId: string): void {
    this.router.navigateByUrl(`/plans/editor/${planId}`);
  }
}
