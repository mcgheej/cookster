import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanEditorDataService } from '../../../plan-editor-data-service';
import {
  DEFAULT_ACTIVITY_COLOR,
  DEFAULT_COLOR_OPACITY,
  DEFAULT_TOOLTIP_SHOW_DELAY,
  googleColors,
} from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { ActivityDB, ActivityTemplateDB } from '@util/data-types/index';
import { CkDrag, DragResult, DragTemplateActivity, DragTemplateActivityResult } from '@ui/drag-and-drop/index';

@Component({
  selector: 'ck-activity-template',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, CkDrag],
  templateUrl: './activity-template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTemplate {
  private readonly hostElementRef = inject(ElementRef<HTMLElement>);
  private readonly planEditorData = inject(PlanEditorDataService);

  readonly template = input.required<ActivityTemplateDB>();
  protected readonly editTemplate = output<void>();
  protected readonly deleteTemplate = output<void>();
  protected readonly createActivityFromTemplate = output<ActivityDB>();

  protected readonly vm = computed(() => {
    const template = this.template();
    const color = opaqueColor(
      googleColors[template.color].color || googleColors[DEFAULT_ACTIVITY_COLOR].color,
      DEFAULT_COLOR_OPACITY
    );
    return {
      name: template.name,
      color,
      actionsPresent: template.actions.length > 0,
      opacity: this.showButtons() ? 0.7 : 0,
    };
  });

  protected readonly dragOperation = computed(() => {
    const template = this.template();
    const plan = this.planEditorData.currentPlan();
    const activity = {
      id: '',
      name: template.name,
      description: template.description,
      duration: template.duration,
      actions: template.actions,
      color: template.color,
      startMessage: template.startMessage,
      endMessage: template.endMessage,
      startTimeOffset: 200,
      planId: plan ? plan.properties.id : '',
      resourceIndex: 0,
    };
    return new DragTemplateActivity({
      id: 'drag-template-activity',
      plan,
      template,
      activity,
      hostWidthPx: this.hostElementRef.nativeElement.offsetWidth,
      hostHeightPx: this.hostElementRef.nativeElement.offsetHeight,
    });
  });

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  private showButtons = signal<boolean>(false);

  onEditTemplate(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.editTemplate.emit();
  }

  onDeleteTemplate(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    this.deleteTemplate.emit();
  }

  onDragEnd(result: DragResult | undefined) {
    if (result) {
      this.createActivityFromTemplate.emit((result as DragTemplateActivityResult).newActivity);
    }
  }

  onEnterTemplate() {
    this.showButtons.set(true);
  }

  onLeaveTemplate() {
    this.showButtons.set(false);
  }
}
