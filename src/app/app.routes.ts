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
    path: 'colors',
    loadComponent: () => import('@feature/colors/index').then((m) => m.Colors),
    canActivate: [authGuard('/login')],
  },
  {
    path: 'plans/editor/:planId',
    loadComponent: () => import('@feature/plan-editor/index').then((m) => m.PlanEditor),
    canActivate: [authGuard('/login')],
  },
  {
    path: 'plans/alarms/:planId',
    loadComponent: () => import('@feature/alarms-runner/index').then((m) => m.AlarmsRunner),
  },
  {
    path: 'plans',
    loadComponent: () => import('@feature/plans/index').then((m) => m.Plans),
    canActivate: [authGuard('/login')],
  },
  {
    path: 'kitchens',
    loadComponent: () => import('@feature/kitchens/index').then((m) => m.Kitchens),
    canActivate: [authGuard('/login')],
  },
  { path: '**', loadComponent: () => import('@feature/page-not-found/index').then((m) => m.PageNotFound) },
];
