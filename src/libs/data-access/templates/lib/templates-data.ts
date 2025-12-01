import { inject, Injectable } from '@angular/core';
import { AfTemplatesService } from './af-templates';
import { ActivityTemplateDB } from '@util/data-types/index';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplatesDataService {
  private readonly db = inject(AfTemplatesService);

  private readonly templates = new Map<string, ActivityTemplateDB>();
  private readonly templatesMapSubject$ = new BehaviorSubject<Map<string, ActivityTemplateDB>>(this.templates);
  readonly templatesMap$ = this.templatesMapSubject$.asObservable();
  readonly templates$ = this.templatesMap$.pipe(map((map) => Array.from(map.values())));

  constructor() {
    this.db.templatesChanges$.subscribe((changes) => {
      changes.forEach((change) => {
        switch (change.type) {
          case 'added':
          case 'modified':
            this.templates.set((change.templateDB as ActivityTemplateDB).id, change.templateDB as ActivityTemplateDB);
            break;
          case 'removed':
            this.templates.delete((change.templateDB as ActivityTemplateDB).id);
            break;
          case 'flush':
            this.templates.clear();
            break;
        }
      });
      this.templatesMapSubject$.next(new Map(this.templates));
    });
  }

  createActivityTemplate(template: ActivityTemplateDB): Observable<ActivityTemplateDB> {
    return this.db.createActivityTemplate(template);
  }

  updateTemplateActivity(templateId: string, updates: Partial<ActivityTemplateDB>): Observable<void> {
    return this.db.updateTemplateActivity(templateId, updates);
  }

  deleteActivityTemplate(templateId: string): Observable<void> {
    return this.db.deleteActivityTemplate(templateId);
  }
}
