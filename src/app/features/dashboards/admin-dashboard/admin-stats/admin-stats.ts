import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { PropertyService } from '../../../../core/services/property.service';
import { BookingService } from '../../../../core/services/booking.service';
import { UserService } from '../../../../core/services/user-service';
import { BookingStatus } from '../../../../core/models/booking-dto';
import { AdminStats } from '../../../../core/models/stats-dto';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './admin-stats.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl:'./admin-stats.css'
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
   
    forkJoin({
      users: this.userService.getAllUsers().pipe(
        catchError(err => { console.error('Hiba a usereknél:', err); return of([]); })
      ),
      properties: this.propertyService.getAllProperties().pipe(
        catchError(err => { console.error('Hiba az ingatlanoknál:', err); return of([]); })
      ),
      pendingProperties: this.propertyService.getPendingProperties().pipe(
        catchError(err => { console.error('Hiba a függő ingatlanoknál:', err); return of([]); })
      ),
      bookings: this.bookingService.getAllBookings().pipe(
        catchError(err => { console.error('Hiba a foglalásoknál:', err); return of([]); })
      )
    }).subscribe({
      next: (res) => {
        this.calculateStats(res.users, res.properties, res.pendingProperties, res.bookings);
        this.loading = false;
      },
      error: (err) => {
        console.error('Kritikus hiba a statisztikák lekérésekor:', err);
        this.loading = false;
      }
    });
  }

  private calculateStats(users: any[], properties: any[], pendingProperties: any[], bookings: any[]): void {
    this.stats.totalUsers = users.length;
    this.stats.totalHosts = users.filter(u => u.role === 'Host').length;
    this.stats.totalProperties = properties.length + pendingProperties.length;
    this.stats.pendingProperties = pendingProperties.length;
    this.stats.totalBookings = bookings.length;
    this.stats.confirmedBookings = bookings.filter(b => b.status === BookingStatus.Confirmed || b.status === 1 || b.status === 'Confirmed').length;

    this.stats.totalRevenue = bookings
      .filter(b => b.status === BookingStatus.Confirmed || b.status === 1 || b.status === 'Confirmed')
      .reduce((sum, b) => {
        const prop = properties.find(p => p.id === b.propertyId) || pendingProperties.find(p => p.id === b.propertyId);
        if (prop) {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          const validDays = days > 0 ? days : 1; 
          return sum + (validDays * prop.pricePerNight);
        }
        return sum;
      }, 0);
  }
}