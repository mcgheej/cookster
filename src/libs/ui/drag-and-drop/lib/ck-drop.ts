import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { DropAreasManager } from './drop-area-manager';
import { DropArea } from './drop-areas/drop-area';

@Directive({
  selector: '[ckDrop]',
})
export class CkDrop implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef<HTMLElement>);
  private dropAreaManager = inject(DropAreasManager);

  ckDrop = input.required<DropArea>();

  ngAfterViewInit(): void {
    const dropArea = this.ckDrop();
    dropArea.hostElement = this.elementRef.nativeElement;
    this.dropAreaManager.registerDropArea(dropArea);
  }

  ngOnDestroy(): void {
    this.dropAreaManager.deRegisterDropArea(this.ckDrop().id);
  }
}
