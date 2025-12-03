import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from './preview-component-base';
import { DragTemplateActivity } from '../drag-operations/operations/drag-template-activity';
import { DEFAULT_COLOR_OPACITY, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';

@Component({
  selector: 'ck-preview-template-activity',
  template: `
    @if (vm(); as vm) {
      <div
        class="fixed rounded-[6px] grid grid-rows-[1fr_26px]"
        [style.top.px]="vm.offsetPosition.y"
        [style.left.px]="vm.offsetPosition.x"
        [style.width.px]="vm.widthPx"
        [style.height.px]="vm.heightPx"
        [style.backgroundColor]="vm.backgroundColor">
        <div class="self-center justify-self-center select-none text-center text-xs px-1">{{ vm.name }}</div>
        <!-- <div class="w-[95%] h=[90%]" [style.backgroundColor]="vm.backgroundColor"></div> -->
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewTemplateActivity extends PreviewComponentBase {
  previewProps = input.required<PreviewComponentProps>();

  protected readonly vm = computed(() => {
    const { pointerPos, dragOp: baseDragOp } = this.previewProps();
    const dragOp = baseDragOp as DragTemplateActivity;
    return {
      offsetPosition: pointerPos.offsetPosition,
      widthPx: dragOp.hostWidthPx * 0.95 - 1,
      heightPx: dragOp.hostHeightPx * 0.9,
      backgroundColor: opaqueColor(googleColors[dragOp.template.color].color || '#888888', DEFAULT_COLOR_OPACITY),
      name: dragOp.template.name,
    };
  });
}
