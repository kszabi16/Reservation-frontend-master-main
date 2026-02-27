import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { BookingDto, BookingStatus } from '../../../core/models/booking-dto';

@Component({
  selector: 'booking-admin',
  standalone: true,
  templateUrl: './booking-admin-component.html',
  imports: [CommonModule, FormsModule, DatePipe]
})
export class BookingAdminComponent {

  bookings: BookingDto[] = [];
  BookingStatus = BookingStatus;

  statusFilter: BookingStatus | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.statusFilter === null) {
      this.bookingService.getAllBookings().subscribe(res => this.bookings = res);
    } else {
      this.bookingService.getByStatus(this.statusFilter).subscribe(res => this.bookings = res);
    }
  }

  confirm(id: number) {
    this.bookingService.confirmBooking(id).subscribe(() => this.load());
  }

  cancel(id: number) {
    this.bookingService.cancelBooking(id).subscribe(() => this.load());
  }
}
