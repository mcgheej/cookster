import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityPanelButtons } from './activity-panel-buttons/activity-panel-buttons';
import { SelectedActivityPanelService } from './selected-activity-panel-service';

@Component({
  selector: 'ck-selected-activity-panel',
  imports: [ActivityPanelButtons],
  template: `
    @if (selectedActivity(); as activity) {
      <div class="ml-1">
        <div
          class="inline-block size-[10px] rounded-[50%]"
          [style.backgroundColor]="service.getRGBColor(activity.color)"></div>
        <div class="inline-block pl-1 pt-2 font-bold text-sm select-none">Selected Activity:</div>
      </div>
      <div class="pl-[18px] text-sm select-none">{{ activity.name }}</div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Time:</div>
      <div class="pl-[18px] text-sm select-none">{{ timeString() }}</div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Resource:</div>
      <div class="pl-[18px] text-sm select-none">{{ resourceName() }}</div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Description:</div>
      <div class="ml-[13px] mt-1 border border-gray-300 w-[273px] h-[80px] overflow-auto">
        <div class="pl-1 pr-1 text-sm select-none">{{ activity.description || 'No description' }}</div>
      </div>
      <div class="pl-[18px] pt-2 font-bold text-sm select-none">Actions:</div>
      <div class="border border-gray-300 mt-1 ml-4 w-[273px] h-[150px] overflow-auto">
        @if (activity.actions.length > 0) {
          @for (actionText of actionsAsText(); track $index) {
            <div class="pl-1 pr-1 text-sm select-none">{{ actionText }}</div>
          }
        } @else {
          <div class="pl-1 pr-1 text-sm select-none">No actions</div>
        }
      </div>
      <div class="pt-2 pl-[18px]">
        <ck-activity-panel-buttons
          (edit)="service.editActivity()"
          (createTemplate)="service.createTemplateFromActivity()"
          (delete)="service.deleteActivity(activity)"></ck-activity-panel-buttons>
      </div>
    } @else {
      <div class="ml-1">
        <div class="inline-block pl-1 pt-2 font-bold text-sm select-none">No activities selected</div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectedActivityPanelService],
})
export class SelectedActivityPanel {
  protected readonly service = inject(SelectedActivityPanelService);

  protected readonly selectedActivity = this.service.selectedActivity;
  protected readonly timeString = this.service.timeString;
  protected readonly resourceName = this.service.resourceName;
  protected readonly actionsAsText = this.service.actionsAsText;
}
