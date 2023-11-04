import { v4 as uuid } from 'uuid';

export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  plot: string;
  comment: string;
  poster?: string;
}

export const EMPTY_MOVIE: Movie = {
  id: uuid(),
  title: '',
  genre: '',
  plot: '',
  year: '',
  comment: '',
  poster: '',
};
