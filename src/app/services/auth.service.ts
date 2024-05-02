import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import Credentials from '../utils/credentials';
import { HttpClient } from '@angular/common/http';
import RegisterForm from '../utils/types/register-form';
import { SignInResponse } from '../utils/types/sign-in-response';
import { SignUpResponse } from '../utils/types/sign-up-response';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl = environment.baseApiUrl
  private _http = inject(HttpClient);
  _isAuthenticated = false;
  currentUser!: string | undefined;

  testProfilSignal = signal('')

  set accessToken(token: string) {
    window.localStorage?.setItem('token', token);
  }
  set currentIdUser(id: string) {
    this.currentUser = id;
  }

  get currentIdUser(): string | undefined {
    return this.currentUser
  }

  get accessToken(): string {
    return window.localStorage?.getItem('token') ?? '';
  }

  logout() {
    window.localStorage.removeItem('token');
    this._isAuthenticated = false;
  }

  isAuthenticated(): boolean {
    return (this._isAuthenticated = !!this.accessToken);
  }

  connexionForm(credentials: Credentials): Observable<SignInResponse> {
    return this._http
      .post<SignInResponse>(`${this.baseUrl}log/in`, credentials)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error))
        }),
        tap((response: SignInResponse) => {
          if (response.isAuthenticated) {
            // Stocker le jeton d'accès dans localStorage
            this.accessToken = response.token;

            // Mettre à jour l'état d'authentification dans le service d'authentification
            this._isAuthenticated = true;


            this.updateUserIsAuthenticated(response.id).subscribe({
              next: () => {

                if (response.id) {
                  this.currentIdUser = response.id
                  this.testProfilSignal.set(this.currentIdUser)
                  console.log("user id", this.currentIdUser);
                }
                console.log(
                  'Utilisateur marqué comme authentifié dans la base de données'
                )
              },
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
    return this._http.patch<any>(`${this.baseUrl}users/${id}`, {
      isAuthenticated: true,
    });
  }

  registerForm(formData: RegisterForm): Observable<SignUpResponse> {
    return this._http.post<SignUpResponse>(
      `${this.baseUrl}log/up`,
      formData
    ).pipe(
      catchError(error => {
        return throwError(() => new Error(error))
      })
    )
  }
}
