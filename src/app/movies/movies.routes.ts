import { Route } from '@angular/router';

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
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/movie-detail/movie-detail.component').then(
        (c) => c.MovieDetailComponent
      ),
  },
];
