import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  baseUrl = environment.baseApiUrl
  constructor() { }
}
