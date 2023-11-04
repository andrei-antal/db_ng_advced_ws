import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { EMPTY_MOVIE, Movie } from '../model/movie';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  #movieApi = `${environment.apiUrl}/movies`;
  #movies$ = new Subject<Movie[]>();
  movies$ = this.#movies$.asObservable();

  constructor(private http: HttpClient) {}

  getMovies(searchTerm = ''): void {
    this.http
      .get<Movie[]>(`${this.#movieApi}?q=${searchTerm.trim()}`)
      .pipe(catchError(() => of([])))
      .subscribe((data) => this.#movies$.next(data));
  }

  updateComment(movieId: string, newComment: string): Observable<Movie> {
    return this.http
      .patch<Movie>(`${this.#movieApi}/${movieId}`, { comment: newComment })
      .pipe(tap(() => this.getMovies()));
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.http
      .delete(`${this.#movieApi}/${movieId}`)
      .pipe(tap(() => this.getMovies()));
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
}
