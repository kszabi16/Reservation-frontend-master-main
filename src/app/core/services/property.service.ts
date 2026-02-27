import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PropertyDto } from '../models/property-dto';
import { CreatePropertyDto } from '../models/property-dto';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/property`;

  constructor(private http: HttpClient) {}


  getAllProperties(): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(this.apiUrl);
  }


  getPropertyById(id: number): Observable<PropertyDto> {
    return this.http.get<PropertyDto>(`${this.apiUrl}/${id}`);
  }


  createProperty(dto: CreatePropertyDto): Observable<PropertyDto> {
    return this.http.post<PropertyDto>(this.apiUrl, dto);
  }


  updateProperty(id: number, dto: CreatePropertyDto): Observable<PropertyDto> {
    return this.http.put<PropertyDto>(`${this.apiUrl}/${id}`, dto);
  }


  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

 
  getPropertiesByHostId(hostId: number): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(`${this.apiUrl}/host/${hostId}`);
  }


  getPropertiesByLocation(location: string): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(`${this.apiUrl}/location/${location}`);
  }

 
  getPropertiesByPriceRange(minPrice: number, maxPrice: number): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(`${this.apiUrl}/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }

  
  getPropertiesByCapacity(minCapacity: number): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(`${this.apiUrl}/capacity/${minCapacity}`);
  }

  searchProperties(term?: string, minPrice?: number, maxPrice?: number, capacity?: number): Observable<PropertyDto[]> {
  
  
  let params = new HttpParams();
  if (term) params = params.set('searchTerm', term);
  if (minPrice) params = params.set('minPrice', minPrice);
  if (maxPrice) params = params.set('maxPrice', maxPrice);
  if (capacity) params = params.set('capacity', capacity);

  return this.http.get<PropertyDto[]>(`${this.apiUrl}/search`, { params });
}

 
  getAllPropertiesForAdmin(): Observable<PropertyDto[]> {
    return this.http.get<PropertyDto[]>(`${this.apiUrl}/all`);
  }
}
