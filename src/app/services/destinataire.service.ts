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

  createDestinataire(destinataire: Destinataire): Observable<Destinataire> {
    console.log("hello donation service", destinataire);
    return this._httpClient.post<Destinataire>('http://localhost:3000/api/v1/destinataires', destinataire);
    // return this._http.post<Donation>(`${this.baseUrl}donations`, donation);
  }

  getDestinataires(): Observable<Destinataire[]> {
    return this._httpClient.get<Destinataire[]>(`${this.baseUrl}destinataires`)
  }


  updateDestinataire(id: string, destinataire: Destinataire): Observable<Destinataire> {

    console.log("hello update", destinataire);
    return this._httpClient.patch<Destinataire>(`${this.baseUrl}destinataires/${id}`, destinataire)
  }


  deleteDestinataire(id: string): Observable<Destinataire> {
    const url = `${this.baseUrl}destinataires/${id}`;
    return this._httpClient.delete<Destinataire>(url);
  }
}
