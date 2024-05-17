import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RegisterForm from '../utils/types/register-form';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseApiUrl;

  constructor(private _httpClient: HttpClient) {}

  getProfile(): Observable<any> {
    return this._httpClient.get<any>(`${this.baseUrl}users/profil`);
  }

  updateProfile(
    id: string,
    updatedProfile: RegisterForm
  ): Observable<RegisterForm> {
    return this._httpClient.patch<RegisterForm>(
      `${this.baseUrl}users/${id}`,
      updatedProfile
    );
  }

  updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    const url = `${this.baseUrl}users/password/${userId}`; // Remplace avec l'URL correcte de ton API
    const body = { oldPassword, newPassword };
    return this._httpClient.put<any>(url, body);
  }
}
