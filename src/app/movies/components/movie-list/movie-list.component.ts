import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CommentUpdate,
  MovieItemComponent,
} from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import { Subject, debounceTime, startWith, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  movies$ = this.searchField.valueChanges.pipe(
    debounceTime(300),
    startWith(undefined),
    switchMap((searchTerm) => this.movieService.getMovies(searchTerm)),
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
