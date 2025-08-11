import { Routes } from '@angular/router';
import { authGuard, notAuthGuard } from '@data-access/authentication/index';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('@feature/login/index').then((m) => m.Login),
    canActivate: [notAuthGuard('/plans')],
  },
  {
    path: 'home',
    loadComponent: () => import('@feature/home/index').then((m) => m.Home),
  },
  {
    path: 'plans',
    loadComponent: () => import('@feature/plans/index').then((m) => m.Plans),
    canActivate: [authGuard('/login')],
  },
  { path: '**', loadComponent: () => import('@feature/page-not-found/index').then((m) => m.PageNotFound) },
];
