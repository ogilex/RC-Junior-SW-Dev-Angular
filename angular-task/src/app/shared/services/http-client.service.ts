import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  API_URL = 'https://rc-vault-fap-live-1.azurewebsites.net/api/'
  constructor(private http: HttpClient) { }

  get<T>(path: String){
    return this.http.get<T>(`${this.API_URL}${path}`);
  }


}
