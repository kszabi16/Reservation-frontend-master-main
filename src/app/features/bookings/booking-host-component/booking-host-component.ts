import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingDto, BookingStatus } from '../../../core/models/booking-dto';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-host',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-host-component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BookingHostComponent implements OnInit {
  bookings: BookingDto[] = [];
  BookingStatus = BookingStatus; // Hogy a HTML-ben tudjuk használni az Enumot

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    // Lekéri a Host összes foglalását
    this.bookingService.getHostBookings().subscribe({
      next: (res) => this.bookings = res,
      error: (err) => console.error('Hiba a foglalások betöltésekor:', err)
    });
  }

  confirm(id: number): void {
    this.bookingService.confirmBooking(id).subscribe({
      next: () => this.loadBookings(), // Sikeres jóváhagyás után újratöltjük a listát
      error: (err) => console.error('Hiba az elfogadáskor:', err)
    });
  }

  cancel(id: number): void {
    if(confirm('Biztosan elutasítod / lemondod ezt a foglalást?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => this.loadBookings(), // Sikeres lemondás után újratöltjük
        error: (err) => console.error('Hiba a lemondáskor:', err)
      });
    }
  }
}