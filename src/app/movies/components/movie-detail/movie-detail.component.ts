import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { Movie } from '../../model/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieItemComponent } from '../movie-item/movie-item.component';

@Component({
  selector: 'ngm-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MovieItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit {
  movieForm = this.fb.group({
    title: this.fb.control('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    genre: this.fb.control('', {
      nonNullable: true,
      validators: Validators.required,
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
  });
  #isNewMovie!: boolean;
  #movie!: Movie;

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
      .subscribe((movie) => this.movieForm.patchValue(movie));
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
      this.movieService
        .updateMovie(modifiedMovie)
        .subscribe(() => this.goBack());
    }
  }

  goBack() {
    this.router.navigate(['/movies']);
  }
}
