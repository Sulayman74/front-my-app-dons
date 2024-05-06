import { Injectable, inject, signal } from '@angular/core';

import Donation from '../utils/types/donation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  baseUrl = environment.baseApiUrl

  private _http = inject(HttpClient);
  donationSignal = signal({})
  createDonation(donation: Donation): Observable<Donation> {
    console.log("hello donation service", donation);
    return this._http.post<Donation>('http://localhost:3000/api/v1/donations', donation);
    // return this._http.post<Donation>(`${this.baseUrl}donations`, donation);
  }

  getDonations(): Observable<Donation[]> {
    return this._http.get<Donation[]>(
      `${this.baseUrl}donations`
    )
  }

  updateDonation(id: string, donation: Donation): Observable<Donation> {

    console.log("hello update", donation);
    return this._http.patch<Donation>(`${this.baseUrl}donations/${id}`, donation)
  }

  deleteDonation(id: string): Observable<Donation> {
    const url = `${this.baseUrl}donations/${id}`;
    return this._http.delete<Donation>(url);
  }


}
