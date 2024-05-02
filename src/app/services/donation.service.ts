import { Injectable, inject } from '@angular/core';

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

  createDonation(donation: Donation): Observable<Donation> {
    return this._http.post<Donation>(`${this.baseUrl}donations`, donation);
  }

  getDonations(): Observable<Donation[]> {
    return this._http.get<Donation[]>(
      `${this.baseUrl}donations`
    )
  }
}
