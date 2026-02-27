import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingStatus } from '../models/booking-dto';
import { BookingDto } from '../models/booking-dto';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = 'https://localhost:7225/api/booking';

  constructor(private http: HttpClient) {}

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-bookings`);
  }
  getAllBookings():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/get-all`);//megkell csinálni backenden controllerre
  }

  getHostBookings() {
  return this.http.get<BookingDto[]>(`${this.baseUrl}/booking/property/{hostOwned}`);
}
  createBooking(dto: any): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  confirmBooking(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/confirm`, {});
  }

  cancelBooking(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/cancel`, {});
  }

  getByGuest(guestId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/guest/${guestId}`);
  }

  getByProperty(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/property/${propertyId}`);
  }

  getByStatus(status: BookingStatus) {
  return this.http.get<BookingDto[]>(`${this.baseUrl}/status/${status}`);
}


  getByDateRange(start: string, end: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/date-range?startDate=${start}&endDate=${end}`);
  }
  
  getPendingBookings(): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(`${this.baseUrl}/status/0`); 
    // Ha a backend végpontja máshogy van, pl. my-properties-bookings/pending, akkor azt írd ide!
  }

  updateStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/${id}/status`, status);
  }
}
