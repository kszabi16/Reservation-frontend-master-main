import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/property.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyDto } from '../../../core/models/property-dto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class PropertyListComponent implements OnInit {
  properties: PropertyDto[] = [];
  filtered: PropertyDto[] = [];
  loading = false;
  error = '';

  location = '';
  minPrice = 0;
  maxPrice = 0;
  minCapacity = 0;

  favoritePropertyIds: Set<number> = new Set<number>();
  constructor(

    private propertyService: PropertyService,
    private favoriteService: FavoriteService,
    public authService: AuthService
    ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.filtered = data;
        this.loading = false;

        if (this.authService.isLoggedIn()) {
          this.loadUserFavorites();
        }
      },
      error: () => {
        this.error = 'Nem sikerült betölteni az ingatlanokat.';
        this.loading = false;
      }
    });
  }
  loadUserFavorites(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.favoriteService.getFavoritesByUser(userId).subscribe({
        next: (favorites) => {
          // Kiszedjük a kedvenc propertyId-kat és belerakjuk a Set-be
          this.favoritePropertyIds = new Set(favorites.map(f => f.propertyId));
        },
        error: (err) => console.error('Hiba a kedvencek betöltésekor:', err)
      });
    }
  }

  toggleFavorite(propertyId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert("Kérlek jelentkezz be a kedvencekhez adáshoz!"); // Vagy Toast/Snackbar üzenet
      return;
    }

    // Azonnali UI frissítés (Optimistic UI) a gyorsabb érzetért
    if (this.favoritePropertyIds.has(propertyId)) {
      this.favoritePropertyIds.delete(propertyId);
    } else {
      this.favoritePropertyIds.add(propertyId);
    }

    // Backend hívás
    this.favoriteService.toggleFavorite(propertyId).subscribe({
      next: (res) => {
        // Ha valamiért eltér a backend a mi számításunktól, korrigáljuk
        if (res.isFavorite) {
          this.favoritePropertyIds.add(propertyId);
        } else {
          this.favoritePropertyIds.delete(propertyId);
        }
      },
      error: (err) => {
        console.error('Hiba a kedvencelés során:', err);
        // Hiba esetén visszacsináljuk az UI változást
        this.loadUserFavorites(); 
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.properties.filter(p =>
      (!this.location || p.location.toLowerCase().includes(this.location.toLowerCase())) &&
      (!this.minPrice || p.pricePerNight >= this.minPrice) &&
      (!this.maxPrice || p.pricePerNight <= this.maxPrice) &&
      (!this.minCapacity || p.capacity >= this.minCapacity)
    );
  }

  resetFilters(): void {
    this.location = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.minCapacity = 0;
    this.filtered = [...this.properties];
  }
}
