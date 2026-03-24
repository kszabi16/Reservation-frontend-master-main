import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-favorites.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl:'./user-favorites.css'
})
export class UserFavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = true;
  error = '';
  showToast = false;
  toastMessage = '';

  currentImageIndices: { [key: number]: number } = {};

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService

  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.error = 'Kérlek jelentkezz be a kedvencek megtekintéséhez!';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.favoriteService.getMyFavorites(userId).subscribe({
      next: (data) => {
        this.favorites = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nem sikerült betölteni a kedvenceket.';
        this.loading = false;
      }
    });
  }

 getActualImage(fav: any): string {
  const backendUrl = 'https://localhost:7102';
  
  if (fav.property?.imageUrls && fav.property.imageUrls.length > 0) {
    const index = this.currentImageIndices[fav.propertyId] || 0;
    const imgPath = fav.property.imageUrls[index];
    return imgPath.startsWith('http') ? imgPath : backendUrl + imgPath;
  }

  if (fav.property?.imageUrl) {
    const imgPath = fav.property.imageUrl;
    return imgPath.startsWith('http') ? imgPath : backendUrl + imgPath;
  }

  if (fav.imageUrls && fav.imageUrls.length > 0) {
    const index = this.currentImageIndices[fav.propertyId] || 0;
    const imgPath = fav.imageUrls[index];
    return imgPath.startsWith('http') ? imgPath : backendUrl + imgPath;
  }

  if (fav.imageUrl) {
    const imgPath = fav.imageUrl;
    return imgPath.startsWith('http') ? imgPath : backendUrl + imgPath;
  }

  return 'https://placehold.co/600x400/1e293b/cbd5e1?text=Nincs+k%C3%A9p'; 
}
  removeFavorite(propertyId: number): void {
    const removedItem = this.favorites.find(f => f.propertyId === propertyId);
    this.favorites = this.favorites.filter(f => f.propertyId !== propertyId);

    this.favoriteService.toggleFavorite(propertyId).subscribe({
      next: () => this.displayToast('Ingatlan eltávolítva a kedvencek közül.'),
      error: () => {
        if (removedItem) this.favorites.push(removedItem);
        alert('Nem sikerült eltávolítani a kedvencet.');
      }
    });
  }

  displayToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}