import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HostRequestDto } from '../models/host-request-dto';



@Injectable({ providedIn: 'root' })
export class HostRequestService {
  private api = `${environment.apiUrl}/hostrequest`;

  constructor(private http: HttpClient) {}

 getAllRequests(): Observable<HostRequestDto[]> {
    return this.http.get<HostRequestDto[]>(`${this.api}`);
  }

  getPendingRequests(): Observable<HostRequestDto[]> {
    return this.http.get<HostRequestDto[]>(`${this.api}/pending`);
  }

  approveRequest(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<void> {
  return this.http.delete<void>(`${this.api}/${id}/reject`);
}
}
