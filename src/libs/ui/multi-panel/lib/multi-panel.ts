import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PanelSelector } from './panel-selector/panel-selector';
import { SelectorButton } from './selector-button';
import { PanelContent } from './panel-content/panel-content';
import { COLLAPSED_PANEL_CONTENT_WIDTH, EXPANDED_PANEL_CONTENT_WIDTH } from '@util/app-config/index';

@Component({
  selector: 'ck-multi-panel',
  imports: [PanelSelector, PanelContent],
  templateUrl: './multi-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiPanel {
  readonly selectorButtons = input.required<SelectorButton[]>();

  protected panelWidth = signal(COLLAPSED_PANEL_CONTENT_WIDTH);
  protected selectedButtonName = signal('');

  protected toggleButton(buttonIndex: number) {
    if (this.selectedButtonName() === this.selectorButtons()[buttonIndex].name) {
      this.selectedButtonName.set('');
      this.panelWidth.set(COLLAPSED_PANEL_CONTENT_WIDTH);
    } else {
      this.selectedButtonName.set(this.selectorButtons()[buttonIndex].name);
      this.panelWidth.set(EXPANDED_PANEL_CONTENT_WIDTH);
    }
  }
}
