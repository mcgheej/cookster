import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PlansDataService } from '@data-access/plans/index';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ck-plan-editor',
  imports: [],
  template: `<div>Plan Editor under construction</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEditor implements OnInit, OnDestroy {
  private readonly plansData = inject(PlansDataService);

  readonly planId = input.required<string>();

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.plansData.currentPlanId = this.planId();
    this.plansData.currentPlan$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((plan) => plan !== null)
      )
      .subscribe((currentPlan) => {
        console.log(currentPlan);
      });
    // this.plansData.currentPlanActivities$.pipe(takeUntil(this.unsubscribe$)).subscribe((activities) => {
    // });
  }

  ngOnDestroy(): void {
    this.plansData.currentPlanId = '';
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
