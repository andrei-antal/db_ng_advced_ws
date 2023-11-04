import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Route, provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'movies',
    loadChildren: () =>
      import('./movies/movies.routes').then((m) => m.movieRoutes),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(HttpClientModule), provideRouter(routes)],
};
