import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  Renderer2,
  Type,
  WritableSignal,
} from '@angular/core';
import { PreviewComponentBase, PreviewComponentProps } from './drop-areas/preview-component-base';
import { fromEvent, Subject, Subscription } from 'rxjs';

/**
 * Service responsible for managing drag-and-drop overlay components. When a drag
 * operation is initiated, this service creates an overlay <div> element and
 * appends it to the document body. This overlay captures mouse move and mouse up
 * events during the drag operation, ensuring that drag interactions are smooth and
 * uninterrupted by other UI elements.
 * As the user drags the pointer in and out of different drop areas preview components
 * are attached/detached from this overlay to provide visual feedback on potential drop targets.
 * At most one component is attached to the overlay at any given time.
 */
@Injectable({ providedIn: 'root' })
export class DragAndDropOverlay {
  // Injected Services
  // -----------------
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  // Properties
  // ----------

  /**
   * The overlay element that is created during a drag operation.
   */
  private overlayElement: HTMLElement | null = null;

  /**
   * Readonly property indicating whether the overlay is currently rendered.
   */
  get overlayRendered(): boolean {
    return this.overlayElement !== null;
  }

  /**
   * The component reference currently attached to the overlay. The component will
   * be derived from PreviewComponentBase.
   */
  private _attachedComponentRef: ComponentRef<PreviewComponentBase> | null = null;
  get attachedComponentRef(): ComponentRef<PreviewComponentBase> | null {
    return this._attachedComponentRef;
  }

  mouseMove$: Subject<MouseEvent> | null = null;
  mouseUp$: Subject<MouseEvent> | null = null;

  private mouseMoveSubscription: Subscription | null = null;
  private mouseUpSubscription: Subscription | null = null;

  // Public methods
  // --------------

  /**
   * Creates the drag-and-drop overlay element and appends it to the document body. The overlay
   * covers the whole viewport and has a high z-index to ensure it captures the required mouse
   * events during drag operations.
   *
   * @param r - renderer provided by the CkDrag directive (Renderer2 cannot be injected directly)
   * @returns - overlay element
   */
  create(r: Renderer2): HTMLElement {
    if (this.overlayElement) {
      return this.overlayElement;
    }

    const overlay = r.createElement('div') as HTMLDivElement;
    r.setProperty(overlay, 'id', 'ck-drag-layer');
    r.setStyle(overlay, 'position', 'fixed');
    r.setStyle(overlay, 'top', '0');
    r.setStyle(overlay, 'left', '0');
    r.setStyle(overlay, 'width', '100vw');
    r.setStyle(overlay, 'height', '100vh');
    r.setStyle(overlay, 'z-index', '1000');
    r.setStyle(overlay, 'cursor', 'grabbing');
    r.appendChild(document.body, overlay);
    this.overlayElement = overlay;

    this.mouseMove$ = new Subject<MouseEvent>();
    this.mouseUp$ = new Subject<MouseEvent>();
    this.mouseMoveSubscription = fromEvent<MouseEvent>(overlay, 'mousemove').subscribe((ev) => {
      this.mouseMove$?.next(ev);
    });
    this.mouseUpSubscription = fromEvent<MouseEvent>(overlay, 'mouseup').subscribe((ev) => {
      this.mouseUp$?.next(ev);
    });

    return overlay;
  }

  /**
   * Removes the overlay element from the document body and disposes of any attached
   * component.
   *
   * @param r - renderer provided by the CkDrag directive (Renderer2 cannot be injected directly)
   */
  dispose(r: Renderer2): void {
    if (this.mouseMoveSubscription) {
      this.mouseMove$?.complete();
      this.mouseMove$ = null;
      this.mouseMoveSubscription.unsubscribe();
      this.mouseMoveSubscription = null;
    }
    if (this.mouseUpSubscription) {
      this.mouseUp$?.complete();
      this.mouseUp$ = null;
      this.mouseUpSubscription.unsubscribe();
      this.mouseUpSubscription = null;
    }
    if (this._attachedComponentRef) {
      this.detachComponent(r);
    }
    if (this.overlayElement) {
      r.removeChild(document.body, this.overlayElement);
      this.overlayElement = null;
    }
  }

  attachComponent(
    component: Type<PreviewComponentBase>,
    r: Renderer2,
    previewProps: WritableSignal<PreviewComponentProps>
  ): void {
    if (this._attachedComponentRef) {
      this.detachComponent(r);
    }
    this._attachedComponentRef = createComponent(component, {
      environmentInjector: this.injector,
      bindings: [inputBinding('previewProps', previewProps)],
    });
    r.appendChild(this.overlayElement, this._attachedComponentRef.location.nativeElement);
    this.appRef.attachView(this._attachedComponentRef.hostView);
  }

  /**
   * Detaches the currently attached component from the overlay.
   *
   * @param r - renderer provided by the CkDrag directive (Renderer2 cannot be injected directly)
   */
  detachComponent(r: Renderer2): void {
    if (this._attachedComponentRef) {
      r.removeChild(this.overlayElement, this._attachedComponentRef.location.nativeElement);
      this.appRef.detachView(this._attachedComponentRef.hostView);
      this._attachedComponentRef.destroy();
      this._attachedComponentRef = null;
    }
  }
}
