import { AfterViewInit, Directive, ElementRef, inject, input, output, Renderer2 } from '@angular/core';
import { DragOperation } from './drag-operations/drag-operation';
import { DragAndDropOverlay } from './drag-and-drop-overlay';
import { Point } from '@util/data-types/index';
import { DropAreasManager } from './drop-area-manager';
import { PointerData } from './types/pointer-data';

@Directive({
  selector: '[ckDrag]',
  host: {
    '(click)': 'onClick($event)',
    '(mousedown)': 'onMousedown($event)',
    '(mouseup)': 'onMouseup($event)',
  },
})
export class CkDrag implements AfterViewInit {
  // Injected Services
  // -----------------
  private hostElementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private overlay = inject(DragAndDropOverlay);
  private dropAreasManager = inject(DropAreasManager);

  // Directive Inputs & Outputs
  // --------------------------

  /**
   * Drag operation object defining the behavior of the drag interaction. This will
   * be an instance of a class derived from the abstract class DragOperation. Provided
   * by the component that hosts the drag trigger element.
   */
  ckDrag = input.required<DragOperation>();

  ckDragStarted = output<void>();
  ckDragEnded = output<void>();

  // Properties
  // ----------

  /**
   * Used to manage the lock axis functionality.
   * When locked in the x-axis the drag can only move horizontally and
   * in this case the lockPointerY value is set to the Y position (this
   * doesn't change during the drag). The lockPointerX is set to -1.
   * When locked in the y-axis the drag can only move vertically and
   * in this case the lockPointerX value is set to the X position (this
   * doesn't change during the drag). The lockPointerY is set to -1.
   */
  private lockPointerX = -1;
  private lockPointerY = -1;

  /**
   * Offset between the pointer position and the top-left corner of the
   * host element when the drag started.
   */
  private offset: Point = { x: 0, y: 0 };

  /**
   * Directive Lifecycle Hooks
   * -------------------------
   */
  ngAfterViewInit(): void {
    this.hostElementRef.nativeElement.style.cursor = 'grab';
  }

  // Methods for User Interactions
  // -----------------------------

  /**
   * Do not support click events on element that is a drag trigger
   */
  protected onClick(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
  }

  protected onMousedown(ev: MouseEvent): void {
    const startDragging = true;
    ev.stopPropagation();
    this.initialiseLockPointerValues(ev);
    this.overlay.create(this.renderer);
    this.ckDragStarted.emit();
    this.overlay.mouseMove$?.subscribe((ev) => this.onMousemove(ev));
    this.overlay.mouseUp$?.subscribe((ev) => this.onMouseup(ev));
    const associatedDropAreas = this.dropAreasManager.getDropAreasByDragOperation(this.ckDrag().id);
    this.ckDrag().start({
      pointerPos: this.getPointerPos(ev, startDragging),
      associatedDropAreas,
      overlayService: this.overlay,
      dragOperation: this.ckDrag(),
      renderer: this.renderer,
    });
  }

  /**
   * Ends the drag operation. Pull down the overlay and set the dragging
   * signal to false.
   */
  protected onMouseup(ev: MouseEvent): void {
    ev.stopPropagation();
    this.ckDrag().end({ pointerPos: this.getPointerPos(ev), overlayService: this.overlay, renderer: this.renderer });
    this.overlay.dispose(this.renderer);
    this.ckDragEnded.emit();
  }

  // Private Methods
  // ---------------

  /**
   * Handle the mousemove event while dragging. Start by applying any
   * axis lock to the pointer position.
   */
  private onMousemove(ev: MouseEvent): void {
    ev.stopPropagation();
    this.ckDrag().move({
      pointerPos: this.getPointerPos(ev),
      overlayService: this.overlay,
      dragOperation: this.ckDrag(),
      renderer: this.renderer,
    });
  }

  /**
   * Sets the lock pointer X and Y values based on the lock axis configuration.
   */
  private initialiseLockPointerValues(ev: MouseEvent): void {
    this.lockPointerX = -1;
    this.lockPointerY = -1;
    if (this.ckDrag().lockAxis === 'x') {
      this.lockPointerX = -1;
      this.lockPointerY = ev.clientY;
    } else if (this.ckDrag().lockAxis === 'y') {
      this.lockPointerX = ev.clientX;
      this.lockPointerY = -1;
    }
  }

  private lockPointerPosition(ev: MouseEvent): Point {
    return {
      x: this.lockPointerX !== -1 ? this.lockPointerX : ev.clientX,
      y: this.lockPointerY !== -1 ? this.lockPointerY : ev.clientY,
    };
  }

  private getPointerPos(ev: MouseEvent, startDrag = false): PointerData {
    const rawPosition = { x: ev.clientX, y: ev.clientY };
    const dragPosition = this.lockPointerPosition(ev);
    if (startDrag) {
      this.offset = {
        x: dragPosition.x - this.hostElementRef.nativeElement.getBoundingClientRect().left,
        y: dragPosition.y - this.hostElementRef.nativeElement.getBoundingClientRect().top,
      };
    }
    const offsetPosition = {
      x: dragPosition.x - this.offset.x,
      y: dragPosition.y - this.offset.y,
    };
    return {
      rawPosition,
      dragPosition,
      offsetPosition,
      shiftKey: ev.shiftKey,
    };
  }
}
