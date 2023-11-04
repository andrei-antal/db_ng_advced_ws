import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieItemComponent } from './components/movie-item/movie-item.component';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from '../movies/components/movie-detail/movie-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: MovieListComponent },
      { path: 'new', component: MovieDetailComponent },
      { path: ':id', component: MovieDetailComponent },
    ]),
  ],
  declarations: [MovieItemComponent, MovieListComponent, MovieDetailComponent],
  exports: [MovieItemComponent, MovieListComponent],
})
export class MoviesModule {}
