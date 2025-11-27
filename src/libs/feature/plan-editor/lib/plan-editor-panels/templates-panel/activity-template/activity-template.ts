import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_ACTIVITY_COLOR, DEFAULT_COLOR_OPACITY, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { ActivityTemplateDB } from '@util/data-types/index';

@Component({
  selector: 'ck-activity-template',
  imports: [CommonModule, MatIconModule],
  templateUrl: './activity-template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityTemplate {
  readonly template = input.required<ActivityTemplateDB>();

  protected readonly vm = computed(() => {
    const template = this.template();
    const color = opaqueColor(
      googleColors[template.color].color || googleColors[DEFAULT_ACTIVITY_COLOR].color,
      DEFAULT_COLOR_OPACITY
    );
    console.log('color', color);
    return {
      name: template.name,
      color,
      actionsPresent: template.actions.length > 0,
      opacity: this.showButtons() ? 0.7 : 0,
    };
  });

  private showButtons = signal<boolean>(false);

  onEditTemplate(ev: MouseEvent) {}

  onDeleteTemplate(ev: MouseEvent) {}

  onEnterTemplate() {
    this.showButtons.set(true);
  }

  onLeaveTemplate() {
    this.showButtons.set(false);
  }
}
