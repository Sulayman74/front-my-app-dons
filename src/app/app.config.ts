import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from '@angular/material/snack-bar';

import { ApplicationConfig } from '@angular/core';
import { AuthGuard } from './utils/auth.guard';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3500 },
      useClass: MatSnackBar,
    },
    AuthGuard
  ],
};
