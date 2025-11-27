import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DEFAULT_ACTIVITY_COLOR,
  DEFAULT_COLOR_OPACITY,
  DEFAULT_TOOLTIP_SHOW_DELAY,
  googleColors,
} from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { ActivityTemplateDB } from '@util/data-types/index';

@Component({
  selector: 'ck-activity-template',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './activity-template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTemplate {
  readonly template = input.required<ActivityTemplateDB>();
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

  protected readonly defaultTooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  private showButtons = signal<boolean>(false);

  onEditTemplate(ev: MouseEvent) {}

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
