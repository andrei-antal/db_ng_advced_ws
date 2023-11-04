import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from './movies/components/movie-list/movie-list.component';

@Component({
  selector: 'ngm-root',
  standalone: true,
  imports: [CommonModule, MovieListComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngMovies';
}
