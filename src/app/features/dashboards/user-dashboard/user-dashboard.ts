import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { FavoriteService } from '../../../core/services/favorite.service';
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
export class UserDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  allProperties: any[] = [];
  properties: any[] = [];
  loading = true;
  error = '';
  Math = Math;

  showFilters = false;
  smartSearchQuery = '';

  searchLocation = '';
  checkInDate: string | null = null;
  checkOutDate: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minCapacity: number | null = null;

  minRating: number = 0; 
  selectedAmenities: { [key: string]: boolean } = {
    'Wifi': false,
    'Medence': false,
    'Klíma': false,
    'Szauna': false,
    'Kisállat bevihető': false
  };

  currentImageIndices: { [key: number]: number } = {};
  favoritePropertyIds: Set<number> = new Set<number>();

  @ViewChildren('propertyCard') propertyCards!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;

  getStars(): number[] { return [1, 2, 3, 4, 5]; }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  constructor(
    private propertyService: PropertyService,
    private favoriteService: FavoriteService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedState = sessionStorage.getItem('user_dashboard_search_state');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.smartSearchQuery = state.smartSearchQuery || '';
      this.searchLocation = state.searchLocation || '';
      this.checkInDate = state.checkInDate || null;
      this.checkOutDate = state.checkOutDate || null;
      this.minPrice = state.minPrice;
      this.maxPrice = state.maxPrice;
      this.minCapacity = state.minCapacity;
      this.minRating = state.minRating || 0;
      this.selectedAmenities = state.selectedAmenities || this.selectedAmenities;
    }
    
    this.loadAll();
    this.loadUserFavorites();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1 });

    this.observeCards();
    this.propertyCards.changes.subscribe(() => {
      this.observeCards();
    });
  }

  private observeCards() {
    if (this.propertyCards) {
      this.propertyCards.forEach(card => {
        this.observer.observe(card.nativeElement);
      });
    }
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
  }

  saveSearchState(): void {
    const state = {
      smartSearchQuery: this.smartSearchQuery,
      searchLocation: this.searchLocation,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minCapacity: this.minCapacity,
      minRating: this.minRating,
      selectedAmenities: this.selectedAmenities
    };
    sessionStorage.setItem('user_dashboard_search_state', JSON.stringify(state));
  }

  getNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const start = new Date(this.checkInDate);
    const end = new Date(this.checkOutDate);
    const diff = end.getTime() - start.getTime();
    const nights = Math.ceil(diff / (1000 * 3600 * 24));
    return nights > 0 ? nights : 0;
  }

  getTotalPrice(pricePerNight: number): number {
    const nights = this.getNights();
    return nights > 0 ? nights * pricePerNight : pricePerNight;
  }

  changeCapacity(step: number): void {
    const current = this.minCapacity || 1;
    const nextValue = current + step;
    if (nextValue >= 1) {
      this.minCapacity = nextValue;
      this.applyFilters();
    }
  }

  loadAll(): void {
    this.loading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.allProperties = data;
        this.applyFilters(false); 
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az ingatlanokat.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadUserFavorites(): void {
    const userId = this.authService.getUserIdFromToken(); 
    if (userId) {
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
    const wasFavorite = this.favoritePropertyIds.has(propertyId);
    if (wasFavorite) {
      this.favoritePropertyIds.delete(propertyId);
    } else {
      this.favoritePropertyIds.add(propertyId);
    }
    this.favoriteService.toggleFavorite(propertyId).subscribe({
      next: (res) => {
        if (res.isFavorite) this.favoritePropertyIds.add(propertyId);
        else this.favoritePropertyIds.delete(propertyId);
      },
      error: (err) => {
        console.error('Hiba a kedvencelés során:', err);
        if (wasFavorite) this.favoritePropertyIds.add(propertyId);
        else this.favoritePropertyIds.delete(propertyId);
      }
    });
  }

  applyFilters(shouldSave: boolean = true): void {
    if (this.smartSearchQuery.trim()) {
      this.loading = true;
      this.propertyService.smartSearch(this.smartSearchQuery.trim()).subscribe({
        next: (data) => {
          this.properties = data;
          this.loading = false;
          if (shouldSave) this.saveSearchState();
        },
        error: (err) => {
          console.error('Hiba az okoskeresés során:', err);
          this.error = 'Hiba az okoskeresés során.';
          this.loading = false;
        }
      });
      return;
    }

    let filtered = [...this.allProperties];

    if (this.searchLocation.trim()) {
      const locLower = this.searchLocation.trim().toLowerCase();
      filtered = filtered.filter(p => p.location?.toLowerCase().includes(locLower));
    }
    if (this.minPrice != null) filtered = filtered.filter(p => p.pricePerNight >= this.minPrice!);
    if (this.maxPrice != null) filtered = filtered.filter(p => p.pricePerNight <= this.maxPrice!);
    if (this.minCapacity != null) filtered = filtered.filter(p => p.capacity >= this.minCapacity!);
    if (this.minRating > 0) filtered = filtered.filter(p => (p.averageRating || 0) >= this.minRating);

    const activeAmenities = Object.keys(this.selectedAmenities).filter(k => this.selectedAmenities[k]);
    if (activeAmenities.length > 0) {
      filtered = filtered.filter(p => {
        let amenitiesText = '';
        if (Array.isArray(p.amenities)) {
          amenitiesText = p.amenities.join(' ').toLowerCase();
        } else if (typeof p.amenities === 'string') {
          amenitiesText = (p.amenities as string).toLowerCase();
        } else if (p['amenitiesList']) {
          amenitiesText = (p['amenitiesList'] as string).toLowerCase();
        }
        return activeAmenities.every(a => amenitiesText.includes(a.toLowerCase()));
      });
    }

    this.properties = filtered;
    if (shouldSave) this.saveSearchState();
  }

  resetFilters(): void {
    this.smartSearchQuery = '';
    this.searchLocation = '';
    this.checkInDate = null;
    this.checkOutDate = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.minCapacity = null;
    this.minRating = 0;
    Object.keys(this.selectedAmenities).forEach(k => this.selectedAmenities[k] = false);
    
    sessionStorage.removeItem('user_dashboard_search_state');
    this.properties = [...this.allProperties];
  }

  nextImage(property: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!property.imageUrls || property.imageUrls.length === 0) return;
    const curr = this.currentImageIndices[property.id] || 0;
    this.currentImageIndices[property.id] = (curr + 1) % property.imageUrls.length;
  }

  prevImage(property: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!property.imageUrls || property.imageUrls.length === 0) return;
    const curr = this.currentImageIndices[property.id] || 0;
    this.currentImageIndices[property.id] = (curr - 1 + property.imageUrls.length) % property.imageUrls.length;
  }

  getActualImage(property: any): string {
    if (property.imageUrls && property.imageUrls.length > 0) {
      return property.imageUrls[this.currentImageIndices[property.id] || 0];
    }
    return property.imageUrl || 'https://placehold.co/600x400/1e293b/cbd5e1?text=Nincs+k%C3%A9p'; 
  }
}