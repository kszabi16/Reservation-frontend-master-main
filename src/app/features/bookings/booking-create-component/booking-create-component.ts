import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { CreateBookingDto } from '../../../core/models/booking-dto';

@Component({
  selector: 'booking-create',
  standalone: true,
  templateUrl: './booking-create-component.html',
  imports: [CommonModule, FormsModule]
})
export class BookingCreateComponent {

  model: CreateBookingDto = {
    propertyId: 0,
    guestId: 0,
    startDate: '',
    endDate: ''
  };

  success = false;
  error = '';

  constructor(private bookingService: BookingService) {}

  create() {
    this.error = '';
    this.success = false;

    this.bookingService.createBooking(this.model).subscribe({
      next: () => this.success = true,
      error: e => this.error = e.error || 'Hiba történt.'
    });
  }
}
