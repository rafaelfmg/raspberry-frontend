import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'movies',
    title: 'List movies',
    loadComponent: () => import('./features/movie-list/movie-list.component').then((m) => m.MovieListComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
