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
  selectedFiles: File[] = []

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      
      this.selectedFiles = Array.from(event.target.files);
    } else {
      this.selectedFiles = []; 
    }
  }
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
 submitProperty() {
    this.loading = true;
    this.error = '';
    this.message = '';

  
    this.propertyService.createProperty(this.property).subscribe({
      next: (createdProperty) => {
        
        
        if (this.selectedFiles && this.selectedFiles.length > 0 && createdProperty.id) {
          const formData = new FormData();
          
        
          this.selectedFiles.forEach((file: File) => {
            formData.append('files', file);
          });

         
          this.http.post(`${environment.apiUrl}/property/${createdProperty.id}/upload-images`, formData)
            .subscribe({
               next: () => {
                 this.loading = false;
                 this.message = 'Ingatlan és a képek sikeresen feladva! Az admin hamarosan ellenőrzi.';
                 setTimeout(() => this.router.navigate(['/properties']), 3000);
               },
               error: (err) => {
                 this.loading = false;
                 this.error = 'Az ingatlan létrejött, de a képek feltöltése sikertelen volt.';
                 console.error(err);
               }
            });
        } 
        else {
           this.loading = false;
           this.message = 'Ingatlan sikeresen feladva (képek nélkül)! Az admin hamarosan ellenőrzi.';
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