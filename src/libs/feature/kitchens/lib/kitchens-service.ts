import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfKitchensService } from '@data-access/kitchens/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { map, Observable, of, Subject } from 'rxjs';

@Injectable()
export class KitchensService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly kitchensData = inject(AfKitchensService);

  readonly kitchensArray$ = this.kitchensData.kitchens$.pipe(
    map((kitchensMap) => [...kitchensMap.values()].sort((a, b) => a.name.localeCompare(b.name)))
  );

  createKitchen(): Observable<string> {
    const result$ = new Subject<string>();
    this.kitchensData.createKitchen({ name: 'New Kitchen' }).subscribe({
      next: (newKitchen) => {
        this.snackBar.open('Kitchen created', 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
        result$.next(newKitchen.id);
        result$.complete();
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
        console.error('Error creating kitchen', error);
        result$.complete();
      },
    });
    return result$.asObservable();
  }
}
