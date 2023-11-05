import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Movie,
  TmdbGenre,
  TmdbGenreApiResponse,
  TmdbMovie,
  TmdbMovieApiResponse,
} from '../model/movie';
import { Observable, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  #http = inject(HttpClient);
  #apiKey = environment.tmdbApiKey;
  #apiUrl = 'https://api.themoviedb.org/3';
  #movieApi = `${this.#apiUrl}/movie/popular?api_key=${
    this.#apiKey
  }&include_adult=false`;
  #genreAPi = `${this.#apiUrl}/genre/movie/list?api_key=${this.#apiKey}`;
  #genres?: TmdbGenre[];

  getGenres(): Observable<TmdbGenre[]> {
    return this.#http.get<TmdbGenreApiResponse>(this.#genreAPi).pipe(
      map((data) => data.genres),
      tap((genres) => (this.#genres = genres))
    );
  }

  getMovies(page = 1): Observable<Movie[]> {
    const genres$ = this.#genres ? of(this.#genres) : this.getGenres();
    return genres$.pipe(
      switchMap((genres) =>
        this.#http
          .get<TmdbMovieApiResponse>(`${this.#movieApi}&page=${page}`)
          .pipe(
            map((data) =>
              data.results.map((movie) => this.#parseMovie(movie, genres))
            )
          )
      )
    );
  }

  #parseMovie(movie: TmdbMovie, genres: TmdbGenre[]): Movie {
    const genre = movie.genre_ids
      .map((genreId) => {
        const genre = genres.find((genre) => genre.id === genreId);
        return genre ? genre.name : '';
      })
      .join(', ');

    return {
      id: movie.id.toString(),
      title: movie.title,
      year: movie.release_date.slice(0, 4),
      genre,
      plot: movie.overview,
      comment: '',
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average,
    };
  }
}
