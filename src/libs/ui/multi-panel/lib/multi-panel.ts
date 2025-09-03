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
  // private readonly speechService = inject(SpeechService);

  readonly selectorButtons = input.required<SelectorButton[]>();

  protected panelWidth = signal(+COLLAPSED_PANEL_CONTENT_WIDTH);
  protected selectedButtonName = signal('');
  protected selectedButtonPanelComponent = signal<any | undefined>(undefined);

  protected toggleButton(buttonIndex: number) {
    if (this.selectedButtonName() === this.selectorButtons()[buttonIndex].name) {
      // this.speechService.speak(`Closing panel ${this.selectorButtons()[buttonIndex].name}`);
      this.selectedButtonName.set('');
      this.selectedButtonPanelComponent.set(undefined);
      this.panelWidth.set(+COLLAPSED_PANEL_CONTENT_WIDTH);
    } else {
      // if (this.selectedButtonName() !== '') {
      //   this.speechService.speak(
      //     `Closing panel ${this.selectedButtonName()} and opening panel ${this.selectorButtons()[buttonIndex].name}`
      //   );
      // } else {
      //   this.speechService.speak(`Opening panel ${this.selectorButtons()[buttonIndex].name}`);
      // }
      this.selectedButtonName.set(this.selectorButtons()[buttonIndex].name);
      this.selectedButtonPanelComponent.set(this.selectorButtons()[buttonIndex].panelComponent);
      this.panelWidth.set(+EXPANDED_PANEL_CONTENT_WIDTH);
    }
  }
}
