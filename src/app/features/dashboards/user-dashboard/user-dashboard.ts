import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { PropertyDto } from '../../../core/models/property-dto';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserDashboardComponent implements OnInit {
  properties: PropertyDto[] = [];
  loading = true;
  error = '';
  

 
  searchLocation = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minCapacity: number | null = null;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
    
  }


  loadAll(): void {
    this.loading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az ingatlanokat.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  applyFilters(): void {
  this.loading = true;
  

  this.propertyService.searchProperties(
    this.searchLocation.trim() || undefined,
    this.minPrice || undefined,
    this.maxPrice || undefined,
    this.minCapacity || undefined
  ).subscribe({
    next: (data) => {
      this.properties = data;
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = 'Keresési hiba történt.';
      this.loading = false;
    }
  });
}
  resetFilters(): void {
    this.searchLocation = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minCapacity = null;
    this.loadAll();
  }

}
