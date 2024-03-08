import { Injectable } from '@angular/core';
import { HttpClientService } from '../../shared/services/http-client.service';
import type { Employee } from '../models/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  constructor(private http: HttpClientService) { }

  getEmployees() : Observable<Employee[]>{
    return this.http.get<Employee[]>('gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==');
  }
}
