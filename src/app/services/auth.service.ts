import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import Credentials from '../utils/credentials';
import { HttpClient } from '@angular/common/http';
import RegisterForm from '../utils/types/register-form';
import { SignInResponse } from '../utils/types/sign-in-response';
import { SignUpResponse } from '../utils/types/sign-up-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  _isAuthenticated = false;

  constructor() {}

  set accessToken(token: string) {
    localStorage.setItem('token', token);
  }

  get accessToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  logout() {
    localStorage.removeItem('token');
    this._isAuthenticated = false;
  }

  isAuthenticated(): boolean {
    return (this._isAuthenticated = !!this.accessToken);
  }

  connexionForm(credentials: Credentials): Observable<SignInResponse> {
    return this._http
      .post<SignInResponse>('http://localhost:3000/api/v1/log/in', credentials)
      .pipe(
        tap((response: SignInResponse) => {
          if (response.isAuthenticated) {
            // Stocker le jeton d'accès dans localStorage
            this.accessToken = response.token;

            // Mettre à jour l'état d'authentification dans le service d'authentification
            this._isAuthenticated = true;

            this.updateUserIsAuthenticated(response.id).subscribe({
              next: () =>
                console.log(
                  'Utilisateur marqué comme authentifié dans la base de données'
                ),
              error: (error) =>
                console.error(
                  "Erreur lors de la mise à jour de l'état d'authentification de l'utilisateur:",
                  error
                ),
            });
          }
        })
      );
  }

  private updateUserIsAuthenticated(id: string | undefined): Observable<any> {
    // Envoyer une requête PATCH à votre backend pour mettre à jour l'état d'authentification de l'utilisateur
    return this._http.patch<any>(`http://localhost:3000/api/v1/users/${id}`, {
      isAuthenticated: true,
    });
  }

  registerForm(formData: RegisterForm): Observable<SignUpResponse> {
    return this._http.post<SignUpResponse>(
      'http://localhost:3000/api/v1/log/up',
      formData
    );
  }
}
