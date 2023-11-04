import { AbstractControl, ValidationErrors } from '@angular/forms';
import { GENRES } from '../model/movie-data';
import { Observable, switchMap, of, map } from 'rxjs';
import { MovieService } from './movie.service';

export function genreValidator(
  formControl: AbstractControl
): ValidationErrors | null {
  const movieGenres: string[] =
    formControl.value &&
    formControl.value.split(',').map((g: string) => g.trim());
  return movieGenres &&
    movieGenres.reduce((acc, curr) => {
      return acc && GENRES.includes(curr.toLowerCase());
    }, true)
    ? null
    : { wrongGenre: true };
}

export const genreAsyncValidator =
  (movieService: MovieService) =>
  (formControl: AbstractControl): Observable<ValidationErrors | null> => {
    return movieService.getGenres().pipe(
      map((genres) => {
        const movieGenres: string[] =
          formControl.value &&
          formControl.value.split(',').map((g: string) => g.trim());
        return movieGenres &&
          movieGenres.reduce((acc, curr) => {
            return acc && genres.includes(curr.toLowerCase());
          }, true)
          ? null
          : { wrongGenre: true };
      })
    );
  };
