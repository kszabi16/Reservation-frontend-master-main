import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingDto } from '../../core/models/booking-dto';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalendarComponent implements OnInit {
  bookings: BookingDto[] = [];
  currentDate = new Date(2026, 0, 1); // Alapértelmezett kezdés: 2026. január
  daysInMonth: Date[] = [];
  monthNames = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];
  weekDays = ['Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo', 'Vas'];

  constructor(
    private bookingService: BookingService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.generateCalendar();
  }

  loadBookings(): void {
    const role = this.authService.getRoleFromToken();
    
    // Szerepkör alapú lekérés
    if (role === 'Host') {
      // Itt a host saját ingatlanjainak összes foglalását kérjük le
      this.bookingService.getMyBookings().subscribe(data => this.bookings = data);
    } else {
      // A sima user csak a saját foglalásait látja
      this.bookingService.getMyBookings().subscribe(data => this.bookings = data);
    }
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Előző hónap napjai a kitöltéshez (hogy hétfővel kezdődjön a sor)
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Vasárnap korrekció
    
    for (let i = startDay; i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }
    
    // Aktuális hónap napjai
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    this.daysInMonth = days;
  }

  changeMonth(delta: number): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
    this.generateCalendar();
  }
  resetToDefaultDate(): void {
  this.currentDate = new Date();
  this.generateCalendar();
}

  // Ellenőrzi, hogy egy adott napon van-e foglalás
  getBookingForDate(date: Date): BookingDto | undefined {
    return this.bookings.find(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      // Időpontok nullázása az összehasonlításhoz
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return d >= s && d <= e;
    });
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
}