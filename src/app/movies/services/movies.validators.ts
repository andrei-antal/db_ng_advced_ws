import { AbstractControl, ValidationErrors } from '@angular/forms';
import { GENRES } from '../model/movie-data';

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
