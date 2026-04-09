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

  toggleFavorite(propertyId: number): Observable<ToggleFavoriteResponse> {
    return this.http.post<ToggleFavoriteResponse>(`${this.apiUrl}/toggle/${propertyId}`, {});
  }

  isFavorite(propertyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-favorite/${propertyId}`);
  }

  getMyFavorites(userId: number): Observable<FavoriteDto[]> {
    return this.http.get<FavoriteDto[]>(`${this.apiUrl}/user/${userId}`);
  }
}