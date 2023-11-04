import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommentUpdate } from '../movie-item/movie-item.component';
import { MovieService } from '../../services/movie.service';
import { Subject, debounceTime, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'ngm-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit, AfterViewInit, OnDestroy {
  movies$ = this.movieService.movies$;
  searchField = new FormControl('');
  #destroy$ = new Subject<void>();

  constructor(public movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies();
  }

  ngAfterViewInit(): void {
    this.searchField.valueChanges
      .pipe(debounceTime(300), startWith(''), takeUntil(this.#destroy$))
      .subscribe((searchTerm) => {
        this.movieService.getMovies(searchTerm as string);
      });
  }

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
}
