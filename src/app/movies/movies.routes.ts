import { Route } from '@angular/router';
import { Role } from './services/auth.service';
import { hasRoleGuard } from './guards/has-role.guard';
import { StoreModule } from '@ngrx/store';
import { importProvidersFrom } from '@angular/core';

import { reducer as moviesListReducer } from './store/movies.reducers';

export const movieRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/movie-list/movie-list.component').then(
        (c) => c.MovieListComponent
      ),
    providers: [
      importProvidersFrom(
        StoreModule.forFeature('moviesFeature', moviesListReducer)
      ),
    ],
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
