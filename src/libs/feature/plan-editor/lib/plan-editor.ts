import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlansDataService } from '@data-access/plans/index';
import { MultiPanel } from '@ui/multi-panel/index';
import { selectorButtons } from './selector-buttons';
import { MatDividerModule } from '@angular/material/divider';
import { MatColors } from '@ui/mat-colors/index';

@Component({
  selector: 'ck-plan-editor',
  imports: [MatDividerModule, MultiPanel, MatColors],
  templateUrl: './plan-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEditor implements OnInit {
  private readonly plansData = inject(PlansDataService);

  readonly planId = input.required<string>();

  protected readonly selectorButtons = selectorButtons;
  protected readonly plan = toSignal(this.plansData.currentPlan$, { initialValue: null });

  ngOnInit() {
    this.plansData.currentPlanId = this.planId();
  }
}
