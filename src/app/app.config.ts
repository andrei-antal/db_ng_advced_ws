import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Route, provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { isAuthenticatedGuard } from './movies/guards/is-authenticated.guard';
import { authInterceptor } from './movies/interceptors/auth.interceptor';
import { StoreModule } from '@ngrx/store';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'movies',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () =>
      import('./movies/movies.routes').then((m) => m.movieRoutes),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    importProvidersFrom(StoreModule.forRoot()),
  ],
};
