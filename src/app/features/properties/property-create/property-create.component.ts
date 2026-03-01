import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // <-- EZT HOZZÁADTUK A KÉPFELTÖLTÉSHEZ
import { PropertyService } from '../../../core/services/property.service';
import { CreatePropertyDto } from '../../../core/models/property-dto';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'property-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-create.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyCreateComponent {
  property: CreatePropertyDto = {
    title: '',
    description: '',
    location: '',
    pricePerNight: 0,
    capacity: 1
  };
 
  loading = false;
  message = '';
  error = '';

  selectedFile: File | null = null;

  // Az HttpClient-et is injektálnunk kell a fájlfeltöltés miatt!
  constructor(
    private propertyService: PropertyService, 
    private router: Router,
    private http: HttpClient 
  ) {}

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Ez az egyetlen gombnyomásra lefutó metódus!
  submitProperty() {
    this.loading = true;
    this.error = '';
    this.message = '';

    // 1. Először létrehozzuk az ingatlant
    this.propertyService.createProperty(this.property).subscribe({
      next: (createdProperty) => {
        
        // 2. Ha a felhasználó választott ki képet, azt felküldjük az új végpontra
        if (this.selectedFile && createdProperty.id) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);

          this.http.post(`${environment.apiUrl}/property/${createdProperty.id}/upload-image`, formData)
            .subscribe({
               next: () => {
                 this.loading = false;
                 this.message = 'Ingatlan és kép sikeresen feladva! Az admin hamarosan ellenőrzi.';
                 setTimeout(() => this.router.navigate(['/properties']), 3000);
               },
               error: (err) => {
                 this.loading = false;
                 this.error = 'Az ingatlan létrejött, de a kép feltöltése a Google Drive-ra sikertelen.';
                 console.error(err);
               }
            });
        } 
        // 3. Ha nem volt kép, akkor is jelezzük a sikert
        else {
           this.loading = false;
           this.message = 'Ingatlan sikeresen feladva (kép nélkül)! Az admin hamarosan ellenőrzi.';
           setTimeout(() => this.router.navigate(['/properties']), 3000);
        }

      },
      error: (err) => {
        this.loading = false;
        this.error = 'Nem sikerült létrehozni az ingatlant. Kérlek próbáld újra!';
        console.error(err);
      }
    });
  }
}