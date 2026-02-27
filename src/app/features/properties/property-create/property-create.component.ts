import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- EZT HOZZÁADTUK
import { FormsModule } from '@angular/forms';   
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { CreatePropertyDto } from '../../../core/models/property-dto';

@Component({
  selector: 'property-create',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- FormsModule ÉS CommonModule is itt van
  templateUrl: './property-create.component.html',
  // A styleUrl-t kivettük, mert Tailwind CSS-t használunk, ami megbízhatóbb!
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

  constructor(private propertyService: PropertyService, private router: Router) {}

  createProperty() {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.propertyService.createProperty(this.property).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'A hirdetésed rögzítésre került. Ha új felhasználó vagy, kérelmedet az adminisztrátor fogja jóváhagyni.';
        // 3 másodperc múlva átirányít az ingatlanjaim listájára
        setTimeout(() => this.router.navigate(['/properties']), 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Nem sikerült létrehozni az ingatlant. Kérlek próbáld újra!';
        console.error(err);
      }
    });
  }
}