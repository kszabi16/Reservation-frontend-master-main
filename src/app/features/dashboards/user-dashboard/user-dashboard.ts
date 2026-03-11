import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { FavoriteService } from '../../../core/services/favorite.service'; // <-- EZT BEHÚZTUK
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

  Math = Math;

  currentImageIndices: { [key: number]: number } = {};

  getStars(): number[] {
      return [1, 2, 3, 4, 5];
    }
  // Ide mentjük a bejelentkezett felhasználó kedvenceit!
  favoritePropertyIds: Set<number> = new Set<number>();

  constructor(
    private propertyService: PropertyService,
    private favoriteService: FavoriteService, // <-- INJEKTÁLTUK
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
    // Betöltjük a kedvenceket is az indulásnál!
    this.loadUserFavorites();
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

  // --- KEDVENCEK LOGIKA KEZDŐDIK ---
 loadUserFavorites(): void {
    const userId = this.authService.getUserIdFromToken(); // <-- ID lekérése
    if (userId) {
      // ITT ÁTADJUK A userId-t a szerviznek!
      this.favoriteService.getMyFavorites(userId).subscribe({
        next: (favorites) => {
          this.favoritePropertyIds = new Set(favorites.map(f => f.propertyId));
        },
        error: (err) => console.error('Hiba a kedvencek betöltésekor:', err)
      });
    }
  }

  toggleFavorite(propertyId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert("Kérlek jelentkezz be a kedvencekhez adáshoz!");
      return;
    }

    // Azonnali UI frissítés a gyors érzetért
    const wasFavorite = this.favoritePropertyIds.has(propertyId);
    if (wasFavorite) {
      this.favoritePropertyIds.delete(propertyId);
    } else {
      this.favoritePropertyIds.add(propertyId);
    }

    // Backend hívás
    this.favoriteService.toggleFavorite(propertyId).subscribe({
      next: (res) => {
        if (res.isFavorite) {
          this.favoritePropertyIds.add(propertyId);
        } else {
          this.favoritePropertyIds.delete(propertyId);
        }
      },
      error: (err) => {
        console.error('Hiba a kedvencelés során:', err);
        // Hiba esetén visszacsináljuk
        if (wasFavorite) {
          this.favoritePropertyIds.add(propertyId);
        } else {
          this.favoritePropertyIds.delete(propertyId);
        }
      }
    });
  }
  // --- KEDVENCEK LOGIKA VÉGE ---

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

  nextImage(property: PropertyDto, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!property.imageUrls || property.imageUrls.length === 0) return;
    
    const curr = this.currentImageIndices[property.id] || 0;
    this.currentImageIndices[property.id] = (curr + 1) % property.imageUrls.length;
  }

  prevImage(property: PropertyDto, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!property.imageUrls || property.imageUrls.length === 0) return;
    
    const curr = this.currentImageIndices[property.id] || 0;
    this.currentImageIndices[property.id] = (curr - 1 + property.imageUrls.length) % property.imageUrls.length;
  }

  getActualImage(property: PropertyDto): string {
    if (property.imageUrls && property.imageUrls.length > 0) {
      const index = this.currentImageIndices[property.id] || 0;
      return property.imageUrls[index];
    }
    return property.imageUrl || 'https://cdn.flyonui.com/fy-assets/components/card/image-9.png'; 
  }
}