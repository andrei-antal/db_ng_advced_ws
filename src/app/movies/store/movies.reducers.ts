import {
  createReducer,
  Action,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { Movie } from '../model/movie';

import * as MoviesActions from './movies.actions';

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: any;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: undefined,
};

const moviesReducer = createReducer(
  initialState,
  on(MoviesActions.loadMovies, (state) => ({
    ...state,
    loading: true,
  })),
  on(MoviesActions.loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    loading: false,
    error: undefined,
    movies,
  })),
  on(MoviesActions.loadMoviesFail, (state, error) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MoviesActions.addMovie, (state, movie) => ({
    ...state,
    movies: [...state.movies, movie],
  }))
);

export function reducer(state: MovieState | undefined, action: Action) {
  return moviesReducer(state, action);
}

export const getMovies = (state: MovieState): Movie[] => state.movies;

const getMoviesFeatureState =
  createFeatureSelector<MovieState>('moviesFeature');

export const getAllMovies = createSelector<MovieState, MovieState, Movie[]>(
  getMoviesFeatureState,
  getMovies
);
