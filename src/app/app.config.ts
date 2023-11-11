import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Route, provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { isAuthenticatedGuard } from './movies/guards/is-authenticated.guard';
import { authInterceptor } from './movies/interceptors/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

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
    importProvidersFrom(EffectsModule.forRoot()),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ],
};
