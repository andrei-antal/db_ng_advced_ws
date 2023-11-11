import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MovieImageFallbackDirective } from '../../directives/movie-image-fallback/movie-image-fallback.directive';
import { sciFiGenreYearValidator } from '../../services/movies.validators';
import { GENRES } from '../../model/movie-data';
import { GenreControlComponent } from '../genre-control/genre-control.component';
import { Store } from '@ngrx/store';
import { MovieState } from '../../store/movies.reducers';
import { addMovie } from '../../store/movies.actions';

@Component({
  selector: 'ngm-movie-detail',
  standalone: true,
  imports: [
    RouterModule,
    MovieItemComponent,
    ReactiveFormsModule,
    MovieImageFallbackDirective,
    GenreControlComponent,
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
      genre: this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
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
    { validators: sciFiGenreYearValidator }
  );
  genres = GENRES;
  #isNewMovie!: boolean;
  #movie!: Movie;

  constructor(
    private route: ActivatedRoute,
    private store: Store<MovieState>,
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
        this.#movie = movie;
        this.movieForm.patchValue(movie);
      });
  }

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie,
      ...value,
    };
    if (!this.#isNewMovie) {
      this.movieService
        .createMovie(modifiedMovie)
        .subscribe(() => this.goBack());
    } else {
      this.store.dispatch(addMovie(modifiedMovie));
    }
  }

  goBack() {
    this.router.navigate(['/movies']);
  }
}
