import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  interval,
  merge,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../model/movie';
import { environment } from '../../../environments/environment';

const REFRESH_INTERVAL = 60000;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  #movieApi = `${environment.apiUrl}/movies`;
  #genreApi = `${environment.apiUrl}/genres`;
  #cache$!: Observable<Movie[]>;
  #reload$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  getMovies(searchTerm?: string): Observable<Movie[]> {
    if (!this.#cache$ || searchTerm !== undefined) {
      this.#cache$ = merge(this.#reload$, interval(REFRESH_INTERVAL)).pipe(
        switchMap(() =>
          this.http
            .get<Movie[]>(
              `${this.#movieApi}?q=${searchTerm ? searchTerm.trim() : ''}`
            )
            .pipe(catchError(() => of([])))
        ),
        shareReplay(1)
      );
    }
    return this.#cache$;
  }

  reloadData() {
    this.#reload$.next(null);
  }

  updateComment(movieId: string, newComment: string): Observable<Movie> {
    return this.http
      .patch<Movie>(`${this.#movieApi}/${movieId}`, { comment: newComment })
      .pipe(tap(() => this.reloadData()));
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.http
      .delete(`${this.#movieApi}/${movieId}`)
      .pipe(tap(() => this.reloadData()));
  }

  getMovie(movieId: string): Observable<Movie> {
    if (!movieId) {
      return of(EMPTY_MOVIE);
    }
    return this.http.get<Movie>(`${this.#movieApi}/${movieId}`);
  }

  createMovie(movie: Movie): Observable<any> {
    return this.http.post(`${this.#movieApi}`, movie);
  }

  updateMovie(movie: Movie): Observable<any> {
    return this.http.put(`${this.#movieApi}/${movie.id}`, movie);
  }

  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(this.#genreApi);
  }

  updateRating(movieId: string, rating: number): Observable<Movie> {
    return this.http
      .patch<Movie>(`${this.#movieApi}/${movieId}`, { rating })
      .pipe(tap(() => this.reloadData()));
  }
}
