import {
  Component,
  OnInit,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, switchMap, tap } from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { MovieItemComponent } from '../movie-item/movie-item.component';
import { MovieImageFallbackDirective } from '../../directives/movie-image-fallback/movie-image-fallback.directive';
import { sciFiGenreYearValidator } from '../../services/movies.validators';
import { GENRES } from '../../model/movie-data';
import { GenreControlComponent } from '../genre-control/genre-control.component';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class MovieDetailComponent {
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
  #movie = signal<Movie>(EMPTY_MOVIE);

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const paramMap = toSignal(this.route.paramMap);
    effect(async () => {
      const movieId = paramMap()?.get('id');
      if (movieId) {
        const movie = await this.movieService.getMovie(movieId);
        this.#movie.set(movie);
        this.movieForm.patchValue(movie);
      }
    });
  }

  onSubmit(): void {
    const { value } = this.movieForm;
    const modifiedMovie: Movie = {
      ...this.#movie(),
      ...value,
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
}
