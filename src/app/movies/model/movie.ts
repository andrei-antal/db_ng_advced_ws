import { v4 as uuid } from 'uuid';

export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  plot: string;
  comment: string;
  poster?: string;
  rating: number;
}

export const EMPTY_MOVIE: Movie = {
  id: uuid(),
  title: '',
  genre: '',
  plot: '',
  year: '',
  comment: '',
  poster: '',
  rating: 0,
};

export interface TmdbMovieApiResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenreApiResponse {
  genres: TmdbGenre[];
}

export interface TmdbMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}
