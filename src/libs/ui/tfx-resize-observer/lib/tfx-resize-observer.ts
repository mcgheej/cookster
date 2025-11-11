import { Directive, ElementRef, inject, NgZone, OnDestroy, OnInit, output } from '@angular/core';

export interface TfxResizeEvent {
  boundingRect: DOMRect;
  newRect: DOMRect;
  oldRect?: DOMRect;
  isFirst: boolean;
}

@Directive({
  selector: '[tfxResizeObserver]',
})
export class TfxResizeObserver implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  tfxResizeObserver = output<TfxResizeEvent>();

  private observer: ResizeObserver;
  private oldRect?: DOMRect;

  constructor() {
    this.observer = new ResizeObserver(() => this.zone.run(() => this.observe()));
  }

  ngOnInit(): void {
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private observe(): void {
    const boundingRect = this.elementRef.nativeElement.getBoundingClientRect();
    const newRect = DOMRect.fromRect({
      x: 0,
      y: 0,
      width: this.elementRef.nativeElement.clientWidth,
      height: this.elementRef.nativeElement.clientHeight,
    });
    const resizeEvent: TfxResizeEvent = {
      boundingRect,
      newRect,
      oldRect: this.oldRect,
      isFirst: this.oldRect ? true : false,
    };
    this.oldRect = newRect;
    this.tfxResizeObserver.emit(resizeEvent);
  }
}
