import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FavoriteDto, ToggleFavoriteResponse } from '../models/favorite-dto';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorite`;

  constructor(private http: HttpClient) {}

  /** Váltás: Hozzáadás vagy törlés a kedvencekből */
  toggleFavorite(propertyId: number): Observable<ToggleFavoriteResponse> {
    return this.http.post<ToggleFavoriteResponse>(`${this.apiUrl}/toggle/${propertyId}`, {});
  }

  /** Lekérdezi, hogy a bejelentkezett felhasználónak kedvence-e az adott szállás */
  isFavorite(propertyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-favorite/${propertyId}`);
  }

  /** Egy adott felhasználó összes kedvencének lekérése */
  getFavoritesByUser(userId: number): Observable<FavoriteDto[]> {
    return this.http.get<FavoriteDto[]>(`${this.apiUrl}/user/${userId}`);
  }
}