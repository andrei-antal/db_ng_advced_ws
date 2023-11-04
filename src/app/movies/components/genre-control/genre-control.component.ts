import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

type Genres = {
  action: boolean;
  adventure: boolean;
  comedy: boolean;
  crime: boolean;
  drama: boolean;
  fantasy: boolean;
  historical: boolean;
  horror: boolean;
  mystery: boolean;
  romance: boolean;
  satire: boolean;
  'science fiction': boolean;
  thriller: boolean;
  western: boolean;
};

@Component({
  selector: 'ngm-genre-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './genre-control.component.html',
  styleUrl: './genre-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: GenreControlComponent,
    },
  ],
})
export class GenreControlComponent {
  genres: Genres = {
    action: false,
    adventure: false,
    comedy: false,
    crime: false,
    drama: false,
    fantasy: false,
    historical: false,
    horror: false,
    mystery: false,
    romance: false,
    satire: false,
    'science fiction': false,
    thriller: false,
    western: false,
  };

  onChange!: (genres: string) => {};

  onTouched!: () => {};

  #touched = false;

  writeValue(obj: string): void {
    obj
      .split(', ')
      .map((g) => g.toLowerCase())
      .filter((g) => g)
      .forEach((g) => (this.genres[g as keyof Genres] = true));
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleGenre(genreKey: string): void {
    const key = genreKey as keyof Genres;
    this.genres[key] = !this.genres[key];

    const genres = [];
    for (const [genre, isSelected] of Object.entries(this.genres)) {
      if (isSelected) {
        genres.push(genre);
      }
    }

    this.onChange(genres.join(', '));

    if (!this.#touched) {
      this.#touched = true;
      this.onTouched();
    }
  }
}
