import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SystemLogDto {
  id: number;
  level: string;
  message: string;
  details?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/systemlog`;

  constructor(private http: HttpClient) {}

  getLogs(): Observable<SystemLogDto[]> {
    return this.http.get<SystemLogDto[]>(this.apiUrl);
  }
}