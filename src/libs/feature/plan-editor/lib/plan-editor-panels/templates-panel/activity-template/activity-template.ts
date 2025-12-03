import { CommonModule } from '@angular/common';
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
import { ActivityTemplateDB } from '@util/data-types/index';
import { CkDrag, DragTemplateActivity } from '@ui/drag-and-drop/index';

@Component({
  selector: 'ck-activity-template',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, CkDrag],
  templateUrl: './activity-template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTemplate {
  private readonly hostElementRef = inject(ElementRef<HTMLElement>);
  private readonly planEditorData = inject(PlanEditorDataService);

  readonly template = input.required<ActivityTemplateDB>();
  protected readonly editTemplate = output<void>();
  protected readonly deleteTemplate = output<void>();

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
    return new DragTemplateActivity({
      id: 'drag-template-activity',
      plan: this.planEditorData.currentPlan(),
      template: this.template(),
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

  onEnterTemplate() {
    this.showButtons.set(true);
  }

  onLeaveTemplate() {
    this.showButtons.set(false);
  }
}
