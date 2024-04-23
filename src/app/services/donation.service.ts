import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  private _http = inject(HttpClient);

  getDonations():Observable<any>{
    return this._http.get<any>(
      'http://localhost:3000/api/v1/donations'
    )
  }
}
