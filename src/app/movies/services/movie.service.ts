import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  firstValueFrom,
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

  readonly movies = signal<Movie[]>([]);

  constructor(private http: HttpClient) {}

  async getMovies(searchTerm?: string): Promise<void> {
    const movies = await firstValueFrom(
      this.http
        .get<Movie[]>(
          `${this.#movieApi}?q=${searchTerm ? searchTerm.trim() : ''}`
        )
        .pipe(catchError(() => of([])))
    );
    this.movies.set(movies);
  }

  async updateComment(movieId: string, newComment: string): Promise<void> {
    await firstValueFrom(
      this.http.patch<Movie>(`${this.#movieApi}/${movieId}`, {
        comment: newComment,
      })
    );
    await this.getMovies();
  }

  async deleteMovie(movieId: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.#movieApi}/${movieId}`));
    await this.getMovies();
  }

  getMovie(movieId: string): Promise<Movie> {
    if (!movieId) {
      return Promise.resolve(EMPTY_MOVIE);
    }
    return firstValueFrom(this.http.get<Movie>(`${this.#movieApi}/${movieId}`));
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

  async updateRating(movieId: string, rating: number): Promise<void> {
    await firstValueFrom(
      this.http.patch<Movie>(`${this.#movieApi}/${movieId}`, { rating })
    );
    await this.getMovies();
  }
}
