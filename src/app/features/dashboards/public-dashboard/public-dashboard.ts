import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
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
export class PublicDashboardComponent implements OnInit, AfterViewInit,OnDestroy {
  allProperties: any[] = [];
  properties: any[] = []; 
  loading = true;
  error = '';
  Math = Math;

  showFilters = false;
  // AI Okoskereső
  smartSearchQuery = '';

  // Hagyományos szűrők
  searchLocation = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minCapacity: number | null = null;

  minRating: number = 0; // 0 = mindegy
  selectedAmenities: { [key: string]: boolean } = {
    'Wifi': false,
    'Medence': false,
    'Klíma': false,
    'Szauna': false,
    'Kisállat bevihető': false
  };
  showAuthWarning = false;

  currentImageIndices: { [key: string]: number } = {};
  
  @ViewChildren('propertyCard') propertyCards!: QueryList<ElementRef>;
  private observer!: IntersectionObserver;

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    const savedState = sessionStorage.getItem('dashboard_search_state');
    
    if (savedState) {
      const state = JSON.parse(savedState);
      this.smartSearchQuery = state.smartSearchQuery || '';
      this.searchLocation = state.searchLocation || '';
      this.minPrice = state.minPrice;
      this.maxPrice = state.maxPrice;
      this.minCapacity = state.minCapacity;
      this.minRating = state.minRating || 0;
      this.selectedAmenities = state.selectedAmenities || this.selectedAmenities;
      
      this.allProperties = state.allProperties || [];
      this.properties = state.properties || [];
      this.loading = false;
    } else {
      this.loadAll();
    }
  }
  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1 
    });

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
    if (this.observer) {
      this.observer.disconnect();
    }
  }

 
  saveSearchState(currentProperties: any[]): void {
    const state = {
      smartSearchQuery: this.smartSearchQuery,
      searchLocation: this.searchLocation,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minCapacity: this.minCapacity,
      properties: currentProperties
    };
    sessionStorage.setItem('dashboard_search_state', JSON.stringify(state));
  }
  // ------------------------------------

  toggleFavorite(): void {
    this.displayAuthWarning();
  }

  displayAuthWarning(): void {
    this.showAuthWarning = true;
    setTimeout(() => {
      this.showAuthWarning = false;
    }, 4000);
  }

 loadAll(): void {
    this.loading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.allProperties = data; 
        this.properties = [...this.allProperties]; // Alapból mindent mutatunk
        this.loading = false;
        this.saveSearchState(this.properties);
      },
      error: (err) => {
        this.error = 'Nem sikerült betölteni az ingatlanokat.';
        this.loading = false;
        console.error(err);
      },
    });
  }
  applyFilters(): void {
    // 1. AI Okoskereső (Ha van szöveg, a backendhez fordulunk)
    if (this.smartSearchQuery.trim()) {
      this.loading = true;
      this.propertyService.smartSearch(this.smartSearchQuery.trim()).subscribe({
        next: (data) => {
          this.properties = data;
          this.loading = false;
          this.saveSearchState(data);
        },
        error: (err) => {
          console.error('Hiba az okoskeresés során:', err);
          this.error = 'Hiba az okoskeresés során.';
          this.loading = false;
        }
      });
      return;
    }

    // 2. Kliens oldali KOMBINÁLT hagyományos szűrés (Minden feltételt egyszerre vizsgál)
    let filtered = [...this.allProperties];

    if (this.searchLocation.trim()) {
      const locLower = this.searchLocation.trim().toLowerCase();
      filtered = filtered.filter(p => p.location?.toLowerCase().includes(locLower));
    }

    if (this.minPrice != null) {
      filtered = filtered.filter(p => p.pricePerNight >= this.minPrice!);
    }

    if (this.maxPrice != null) {
      filtered = filtered.filter(p => p.pricePerNight <= this.maxPrice!);
    }

    if (this.minCapacity != null) {
      filtered = filtered.filter(p => p.capacity >= this.minCapacity!);
    }

    if (this.minRating > 0) {
      filtered = filtered.filter(p => (p.averageRating || 0) >= this.minRating);
    }

    // Felszereltségek vizsgálata (Az összes bepipáltnak szerepelnie kell)
    const activeAmenities = Object.keys(this.selectedAmenities).filter(k => this.selectedAmenities[k]);
    if (activeAmenities.length > 0) {
      filtered = filtered.filter(p => {
        const pAmenities = (p.amenitiesList || '').toLowerCase();
        return activeAmenities.every(a => pAmenities.includes(a.toLowerCase()));
      });
    }

    this.properties = filtered;
    this.saveSearchState(this.properties);
  }

  resetFilters(): void {
    this.smartSearchQuery = '';
    this.searchLocation = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minCapacity = null;
    this.minRating = 0;
    
    // Checkboxok alaphelyzetbe állítása
    Object.keys(this.selectedAmenities).forEach(k => this.selectedAmenities[k] = false);
    
    sessionStorage.removeItem('dashboard_search_state');
    
    this.properties = [...this.allProperties]; // Azonnal visszaáll az eredetire
    this.saveSearchState(this.properties);
  }

  nextImage(property: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const id = property.id || property.propertyId;
    if (!property.imageUrls || property.imageUrls.length === 0) return;
    
    const curr = this.currentImageIndices[id] || 0;
    this.currentImageIndices[id] = (curr + 1) % property.imageUrls.length;
  }

  prevImage(property: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const id = property.id || property.propertyId;
    if (!property.imageUrls || property.imageUrls.length === 0) return;
    
    const curr = this.currentImageIndices[id] || 0;
    this.currentImageIndices[id] = (curr - 1 + property.imageUrls.length) % property.imageUrls.length;
  }

  getActualImage(property: any): string {
    const id = property.id || property.propertyId;
    if (property.imageUrls && property.imageUrls.length > 0) {
      const index = this.currentImageIndices[id] || 0;
      return property.imageUrls[index];
    }
    return property.mainImageUrl || property.imageUrl || 'https://placehold.co/600x400/1e293b/cbd5e1?text=Nincs+k%C3%A9p'; 
  }
}