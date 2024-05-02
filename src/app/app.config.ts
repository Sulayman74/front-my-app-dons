import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from '@angular/material/snack-bar';

import { ApplicationConfig } from '@angular/core';
import { AuthGuard } from './utils/auth.guard';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { LOCALE_ID } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import localeFr from '@angular/common/locales/fr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

// Enregistrez la locale française
registerLocaleData(localeFr);


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideAnimations(), provideNativeDateAdapter(MAT_NATIVE_DATE_FORMATS),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'fr' },
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
    { provide: MatPaginatorIntl },
    AuthGuard,
    AuthService,
  ],
};
