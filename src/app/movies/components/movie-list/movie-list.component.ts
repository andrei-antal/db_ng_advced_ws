import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CommentUpdate,
  MovieItemComponent,
} from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import { Subject, debounceTime, startWith, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HasRoleDirective } from '../../directives/has-role/has-role.directive';

@Component({
  selector: 'ngm-movie-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MovieItemComponent,
    RouterModule,
    ReactiveFormsModule,
    HasRoleDirective,
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit, OnDestroy {
  #destroy$ = new Subject<void>();
  searchField = new FormControl('', { nonNullable: true });
  movies = this.movieService.movies;

  constructor(public movieService: MovieService) {}

  ngOnInit() {
    this.searchField.valueChanges
      .pipe(debounceTime(300), startWith(''), takeUntil(this.#destroy$))
      .subscribe((searchTerm) => this.movieService.getMovies(searchTerm));
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  handleCommentUpdate(commentPayload: CommentUpdate): void {
    this.movieService.updateComment(
      commentPayload.id,
      commentPayload.newComment
    );
  }

  handleMovieDelete(movieId: string): void {
    this.movieService.deleteMovie(movieId);
  }

  handleRateMovie(rating: number, movieId: string): void {
    this.movieService.updateRating(movieId, rating);
  }
}
