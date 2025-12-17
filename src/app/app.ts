import { Component } from '@angular/core';
import { Shell } from '@app-container/index';

@Component({
  selector: 'ck-root',
  imports: [Shell],
  template: `<ck-shell></ck-shell>`,
})
export class App {}
