import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../../core/services/property.service';
import { BookingService } from '../../../core/services/booking.service';
import { UserService } from '../../../core/services/user-service';
import { BookingStatus } from '../../../core/models/booking-dto';
import { AdminStats } from '../../../core/models/stats-dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminStatsComponent implements OnInit {
  stats: AdminStats = {
    totalUsers: 0,
    totalHosts: 0,
    totalProperties: 0,
    pendingProperties: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0
  };
  loading = true;

  constructor(
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    
    // Több kérés párhuzamos futtatása
    forkJoin({
      properties: this.propertyService.getAllProperties(),
      bookings: this.bookingService.getAllBookings() // Megjegyzés: a service-ben ezt jelezted, hogy be kell fejezni
    }).subscribe({
      next: (res) => {
        this.calculateStats(res.properties, res.bookings);
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba a statisztikák betöltésekor:', err);
        this.loading = false;
      }
    });
  }

  private calculateStats(properties: any[], bookings: any[]): void {
    this.stats.totalProperties = properties.length;
    this.stats.pendingProperties = properties.filter(p => !p.isApproved).length;
    
    this.stats.totalBookings = bookings.length;
    this.stats.confirmedBookings = bookings.filter(b => b.status === BookingStatus.Confirmed).length;

    // Bevétel számítás (Csak a visszaigazolt foglalásokból)
    this.stats.totalRevenue = bookings
      .filter(b => b.status === BookingStatus.Confirmed)
      .reduce((sum, b) => {
        const prop = properties.find(p => p.id === b.propertyId);
        if (prop) {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          return sum + (days * prop.pricePerNight);
        }
        return sum;
      }, 0);
  }
}