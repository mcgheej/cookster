import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-page-not-found',
  template: ` <div>Page Not Found page under construction</div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFound {}
