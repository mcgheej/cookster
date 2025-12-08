import { ChangeDetectionStrategy, Component, input, linkedSignal, untracked } from '@angular/core';
import { PanelSelector } from './panel-selector/panel-selector';
import { SelectorButton } from './selector-button';
import { PanelContent } from './panel-content/panel-content';
import { COLLAPSED_PANEL_CONTENT_WIDTH, EXPANDED_PANEL_CONTENT_WIDTH } from '@util/app-config/index';

interface SelectedButton {
  name: string;
  panelComponent: any | undefined;
  panelWidth: number;
}

@Component({
  selector: 'ck-multi-panel',
  imports: [PanelSelector, PanelContent],
  templateUrl: './multi-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiPanel {
  // private readonly speechService = inject(SpeechService);

  readonly selectorButtons = input.required<SelectorButton[]>();
  readonly openPanel = input<string>('');

  protected selectedButton = linkedSignal<string, SelectedButton>({
    source: this.openPanel,
    equal: (a, b) => a.name === b.name && a.panelWidth === b.panelWidth && a.panelComponent === b.panelComponent,
    computation: (openPanel, previous) => {
      if (previous) {
        if (openPanel === '' || openPanel === previous.value.name) {
          return previous.value;
        }
        const foundButton = untracked(this.selectorButtons).find((btn) => btn.name === openPanel);
        if (foundButton) {
          return {
            name: foundButton.name,
            panelComponent: foundButton.panelComponent,
            panelWidth: +EXPANDED_PANEL_CONTENT_WIDTH,
          };
        }
      }
      return {
        name: '',
        panelComponent: undefined,
        panelWidth: +COLLAPSED_PANEL_CONTENT_WIDTH,
      };
    },
  });

  protected toggleButton(buttonIndex: number) {
    if (this.selectedButton().name === this.selectorButtons()[buttonIndex].name) {
      this.selectedButton.set({
        name: '',
        panelComponent: undefined,
        panelWidth: +COLLAPSED_PANEL_CONTENT_WIDTH,
      });
    } else {
      this.selectedButton.set({
        name: this.selectorButtons()[buttonIndex].name,
        panelComponent: this.selectorButtons()[buttonIndex].panelComponent,
        panelWidth: +EXPANDED_PANEL_CONTENT_WIDTH,
      });
    }
  }
}
