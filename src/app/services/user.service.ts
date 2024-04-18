import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import Credentials from '../utils/credentials';
import { Observable } from 'rxjs';
import RegisterForm from '../utils/register-form';
import { SignInResponse } from '../utils/sign-in-response';
import { SignUpResponse } from '../utils/sign-up-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);

  constructor() {}

  submitForm(credentials: Credentials): Observable<SignInResponse> {
    return this._http.post<SignInResponse>('http://localhost:3000/api/v1/log/in', credentials);
  }

  registerForm(formData: RegisterForm): Observable<SignUpResponse> {
    return this._http.post<SignUpResponse>('http://localhost:3000/api/v1/log/up', formData);
  }
}
