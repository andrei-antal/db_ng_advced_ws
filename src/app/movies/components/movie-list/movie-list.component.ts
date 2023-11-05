import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CommentUpdate,
  MovieItemComponent,
} from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'ngm-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MovieItemComponent,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnDestroy {
  #destroy$ = new Subject<void>();
  searchField = new FormControl('', { nonNullable: true });

  #tmdbService = inject(TmdbService);

  pageByScroll$ = fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    filter(
      (current) => current >= document.body.clientHeight - window.innerHeight
    ),
    debounceTime(200),
    distinctUntilChanged(),
    startWith(1),
    scan((acc) => acc + 1),
    takeUntil(this.#destroy$)
  );

  movies$ = this.pageByScroll$.pipe(
    switchMap((page) => this.#tmdbService.getMovies(page)),
    scan((acc: any, cur) => [...acc, ...cur], []),
    takeUntil(this.#destroy$)
  );

  constructor(public movieService: MovieService) {}

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  trackByFn(_: any, movie: any): number {
    return movie.id;
  }

  handleCommentUpdate(commentPayload: CommentUpdate): void {
    this.movieService
      .updateComment(commentPayload.id, commentPayload.newComment)
      .subscribe();
  }

  handleMovieDelete(movieId: string): void {
    this.movieService.deleteMovie(movieId).subscribe();
  }

  handleRateMovie(rating: number, movieId: string): void {
    this.movieService.updateRating(movieId, rating).subscribe();
  }
}
