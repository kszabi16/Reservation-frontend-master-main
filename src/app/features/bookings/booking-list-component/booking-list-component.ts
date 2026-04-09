import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { BookingDto, BookingStatus } from '../../../core/models/booking-dto';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './booking-list-component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './booking-list-component.css'
})
export class BookingListComponent implements OnInit {
  bookings: BookingDto[] = [];
  BookingStatus = BookingStatus;
  loading = true;
  error = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nem sikerült betölteni a foglalásokat.';
        this.loading = false;
      }
    });
  }

  cancel(id: number): void {
    if (confirm('Biztosan lemondod ezt a foglalást?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => this.load(),
        error: () => alert('Hiba történt a lemondás során.')
      });
    }
  }
  translateStatus(status: any): string {
    const s = String(status).toLowerCase();
    if (s === 'pending' || s === '0') return 'Jóváhagyásra vár';
    if (s === 'confirmed' || s === '1') return 'Elfogadva';
    if (s === 'cancelled' || s === '2') return 'Lemondva';
    return String(status);
  }

  getStatusClass(status: any): string {
    const s = String(status).toLowerCase();
    if (s === 'pending' || s === '0') return 'status-pending';
    if (s === 'confirmed' || s === '1') return 'status-confirmed';
    if (s === 'cancelled' || s === '2') return 'status-cancelled';
    return '';
  }
}