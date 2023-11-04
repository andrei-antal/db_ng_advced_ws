import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MovieImageFallbackDirective } from '../../directives/movie-image-fallback/movie-image-fallback.directive';
import {
  genreValidator,
  sciFiGenreYearValidator,
} from '../../services/movies.validators';
import { GENRES } from '../../model/movie-data';

@Component({
  selector: 'ngm-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MovieItemComponent,
    ReactiveFormsModule,
    MovieImageFallbackDirective,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit {
  movieForm = this.fb.group(
    {
      title: this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      genre: this.fb.nonNullable.array([] as string[], {
        validators: genreValidator,
        updateOn: 'change',
      }),
      year: this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      plot: this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      poster: this.fb.control('', { nonNullable: true }),
    },
    { validators: sciFiGenreYearValidator, updateOn: 'blur' }
  );
  genres = GENRES;
  #isNewMovie!: boolean;
  #movie!: Movie;

  get genreArray(): FormArray {
    return this.movieForm.get('genre') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((paramsMap) => paramsMap.get('id') as string),
        tap((movieId) => (this.#isNewMovie = !!movieId)),
        switchMap((movieId) =>
          this.movieService
            .getMovie(movieId)
            .pipe(tap((movie) => (this.#movie = movie)))
        )
      )
      .subscribe((movie) => {
        const genre = movie.genre.split(',').map((g) => g.trim().toLowerCase());
        genre.forEach(() => this.addGenre());
        this.movieForm.patchValue({ ...movie, genre });
      });
  }

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie,
      ...value,
      genre: value.genre!.filter((g: string) => g).join(', '),
    };
    if (!this.#isNewMovie) {
      this.movieService
        .createMovie(modifiedMovie)
        .subscribe(() => this.goBack());
    } else {
      this.movieService
        .updateMovie(modifiedMovie)
        .subscribe(() => this.goBack());
    }
  }

  goBack() {
    this.router.navigate(['/movies']);
  }

  addGenre(): void {
    this.genreArray.push(this.fb.nonNullable.control(''));
  }

  removeGenre(index: number): void {
    this.genreArray.removeAt(index);
  }
}
