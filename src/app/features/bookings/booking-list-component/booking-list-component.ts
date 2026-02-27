import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { BookingDto } from '../../../core/models/booking-dto';
import { BookingStatus } from '../../../core/models/booking-dto';

@Component({
  selector: 'booking-list',
  standalone: true,
  templateUrl: './booking-list-component.html',
  imports: [CommonModule, DatePipe]
})
export class BookingListComponent {

  bookings: BookingDto[] = [];
  BookingStatus=BookingStatus;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.bookingService.getMyBookings().subscribe(res => {
      this.bookings = res;
    });
  }

  cancel(id: number) {
    this.bookingService.cancelBooking(id).subscribe(() => this.load());
  }
}
