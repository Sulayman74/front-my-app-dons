import Destinataire from '../utils/types/destinataire';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class DestinataireService {

  baseUrl = environment.baseApiUrl

  constructor(private _httpClient: HttpClient) { }

  getDestinataires(): Observable<Destinataire[]> {
    return this._httpClient.get<Destinataire[]>(`${this.baseUrl}destinataires`)
  }
}
