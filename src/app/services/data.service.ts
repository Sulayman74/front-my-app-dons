import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  urlCountries =
    'https://cors-anywhere.herokuapp.com/https://restcountries.com/v3.1/all';
  urlCities = 'https://geo.api.gouv.fr/communes?codePostal=';
  urlGeoLoc =
    'https://cors-anywhere.herokuapp.com/https://api-adresse.data.gouv.fr/reverse/';
  apiUrl = 'https://api-adresse.data.gouv.fr/search/';
  private _http = inject(HttpClient);

  constructor() {}

  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getCountries(): Observable<any> {
    return this._http.get(this.urlCountries);
  }
  getCities(): Observable<any> {
    return this._http.get(this.urlCities);
  }

  searchAddress(query: string, limit: number = 5):Observable<any> | undefined {
    if (!query) {
      return;
    }
    const params = {
      q: query,
      type: 'municipality',
      limit: limit.toString(),
      autocomplete: '1',
    };
    console.log(query);
    return this._http.get<any>(this.apiUrl, { params })
  }

  getGeoLocation(lat: number, lon: number): Observable<any> {
    let parameters = new HttpParams().append('lat', lat).append('lon', lon);
    return this._http.get(this.urlGeoLoc, { params: parameters });
  }
}
