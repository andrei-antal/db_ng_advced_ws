import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MovieListComponent } from './movies/components/movie-list/movie-list.component';
import { AuthService } from './movies/services/auth.service';

@Component({
  selector: 'ngm-root',
  standalone: true,
  imports: [CommonModule, MovieListComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngMovies';
  authService = inject(AuthService);
  #router = inject(Router);

  logout() {
    this.authService.logout();
    this.#router.navigate(['/']);
  }
}
