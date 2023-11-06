import { Route } from '@angular/router';
import { Role } from './services/auth.service';
import { hasRoleGuard } from './guards/has-role.guard';

export const movieRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/movie-list/movie-list.component').then(
        (c) => c.MovieListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/movie-detail/movie-detail.component').then(
        (c) => c.MovieDetailComponent
      ),
    data: {
      roles: [Role.Admin],
    },
    canActivate: [hasRoleGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/movie-detail/movie-detail.component').then(
        (c) => c.MovieDetailComponent
      ),
    data: {
      roles: [Role.Admin],
    },
    canActivate: [hasRoleGuard],
  },
];
