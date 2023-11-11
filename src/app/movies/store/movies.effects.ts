import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as MovieActions from './movies.actions';

import { MovieService } from '../services/movie.service';
import { map, mergeMap, catchError, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

export const loadMovies$ = createEffect(
  (actions$ = inject(Actions), moviesService = inject(MovieService)) =>
    actions$.pipe(
      ofType(MovieActions.loadMovies),
      mergeMap(() =>
        moviesService.getMovies().pipe(
          map((movies) => MovieActions.loadMoviesSuccess({ movies })),
          catchError((error) => MovieActions.loadMoviesFail(error))
        )
      )
    ) as Observable<Action>,
  { functional: true }
);

export const updateMovie$ = createEffect(
  (actions$ = inject(Actions), moviesService = inject(MovieService)) =>
    actions$.pipe(
      ofType(MovieActions.updateMovie),
      mergeMap((movie) =>
        moviesService
          .updateMovie(movie)
          .pipe(
            map((res: any) =>
              MovieActions.updateMovieSuccess({ id: res.id, changes: res })
            )
          )
      )
    ),
  {
    functional: true,
  }
);
