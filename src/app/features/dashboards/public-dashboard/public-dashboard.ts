import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { PropertyDto } from '../../../core/models/property-dto';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'public-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  templateUrl: './public-dashboard.html',
  styleUrls: ['./public-dashboard.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicDashboardComponent implements OnInit {
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

    if (this.searchLocation.trim()) {
      this.propertyService.getPropertiesByLocation(this.searchLocation.trim()).subscribe({
        next: (data) => {
          this.properties = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
      return;
    }

    if (this.minPrice != null && this.maxPrice != null) {
      this.propertyService.getPropertiesByPriceRange(this.minPrice, this.maxPrice).subscribe({
        next: (data) => {
          this.properties = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
      return;
    }

    if (this.minCapacity != null) {
      this.propertyService.getPropertiesByCapacity(this.minCapacity).subscribe({
        next: (data) => {
          this.properties = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
      return;
    }

    this.loadAll();
  }

  resetFilters(): void {
    this.searchLocation = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minCapacity = null;
    this.loadAll();
  }


  
}
