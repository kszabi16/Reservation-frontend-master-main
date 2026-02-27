import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// ÚJ IMPORTOK:
import { BookingService } from '../../../core/services/booking.service';
import { BookingDto } from '../../../core/models/booking-dto';

@Component({
  selector: 'host-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './host-dashboard.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HostDashboardComponent implements OnInit {
  
  // Értesítésekhez (Függőben lévő foglalásokhoz) szükséges változók
  notifications: BookingDto[] = [];
  loadingNotifications = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  // Függőben lévő foglalások lekérése
  loadNotifications(): void {
    this.loadingNotifications = true;
    this.bookingService.getPendingBookings().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loadingNotifications = false;
      },
      error: (err) => {
        console.error('Hiba az értesítések lekérésekor', err);
        this.loadingNotifications = false;
      }
    });
  }

  // Foglalás elfogadása
  acceptBooking(bookingId: number): void {
    this.bookingService.confirmBooking(bookingId).subscribe({
      next: () => {
        // Kiszedjük a listából a már elbírált foglalást
        this.notifications = this.notifications.filter(b => b.id !== bookingId);
      },
      error: (err) => console.error('Hiba az elfogadáskor', err)
    });
  }

  // Foglalás elutasítása
  rejectBooking(bookingId: number): void {
    if(confirm('Biztosan elutasítod ezt a foglalási kérelmet?')) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(b => b.id !== bookingId);
        },
        error: (err) => console.error('Hiba az elutasításkor', err)
      });
    }
  }
}