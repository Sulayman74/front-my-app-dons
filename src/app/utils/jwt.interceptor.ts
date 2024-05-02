import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { NotificationService } from './error.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public authService = inject(AuthService);

  constructor(private errorService: NotificationService, private router: Router) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Ajouter le JWT dans l'en-tête Authorization s'il est présent dans le localStorage

    const token = this.authService.accessToken;

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        switch (error.status) {
          case 400:
            this.errorService.showError('Bad request error');
            break;
          case 401:
            this.redirectToLogin(), this.errorService.showError('Vous ne pouvez pas accéder à cette page');
            break;
          case 403:
            this.redirectToLogin(), this.errorService.showError('Vous ne pouvez pas accéder à cette page');
            break;
          case 404:
            this.errorService.showError('Pas encore de données');
            break;
          // Ajoutez d'autres cas pour gérer d'autres types d'erreurs ici
          default:
            this.errorService.showError('Une erreur inattendue s\'est produite');
            break;
        }
        console.log(error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  private redirectToLogin() {
    this.router.navigate(['/sign-in']);
  }
}
