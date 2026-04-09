import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingStatus } from '../models/booking-dto';
import { BookingDto } from '../models/booking-dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/booking`;

  constructor(private http: HttpClient) {}

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-bookings`);
  }
  getAllBookings():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/get-all`);//megkell csinálni backenden controllerre
  }

  getHostBookings() {
  return this.http.get<BookingDto[]>(`${this.apiUrl}/booking/property/{hostOwned}`);
}
  createBooking(dto: any): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  confirmBooking(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/confirm`, {});
  }

  cancelBooking(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }

  getByStatus(status: BookingStatus) {
  return this.http.get<BookingDto[]>(`${this.apiUrl}/status/${status}`);
}

  getPendingBookings(): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.apiUrl}/pending-requests`); 
  }

  updateStatus(id: number, status: string) {
    return this.http.put(`${this.apiUrl}/${id}/status`, status);
  }
}
