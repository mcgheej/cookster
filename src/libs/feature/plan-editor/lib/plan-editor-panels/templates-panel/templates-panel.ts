import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { opaqueColor } from '@util/color-utilities/index';
import { DEFAULT_COLOR_OPACITY } from '@util/app-config/index';

import { ActivityTemplate } from './activity-template/activity-template';
import { ActivityTemplateDB } from '@util/data-types/index';
import { TemplatesPanelService } from './templates-panel-service';

@Component({
  selector: 'ck-templates-panel',
  imports: [ActivityTemplate],
  templateUrl: './templates-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TemplatesPanelService],
})
export class TemplatesPanel {
  protected readonly service = inject(TemplatesPanelService);
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly currentPlan = this.planEditorData.currentPlan;
  protected readonly flairColor = computed(() => {
    return opaqueColor(this.planEditorData.planColor(), DEFAULT_COLOR_OPACITY);
  });

  protected readonly activityTemplates = this.planEditorData.activityTemplates;
}
