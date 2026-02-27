import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyDto } from '../../../core/models/property-dto';

@Component({
  selector: 'app-host-all-properties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './host-all-properties.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HostAllPropertiesComponent implements OnInit {
  myProperties: PropertyDto[] = [];
  loading = true;
  error = '';

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyProperties();
  }

  loadMyProperties(): void {
    const hostId = this.authService.getUserIdFromToken();
    if (!hostId) {
      this.error = 'Nem található bejelentkezett felhasználó.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.propertyService.getPropertiesByHostId(hostId).subscribe({
      next: (data) => {
        this.myProperties = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba az ingatlanok betöltésekor:', err);
        this.error = 'Nem sikerült betölteni a saját ingatlanokat.';
        this.loading = false;
      }
    });
  }

  deleteProperty(id: number): void {
    if (confirm('Biztosan törölni szeretnéd ezt az ingatlant?')) {
      this.propertyService.deleteProperty(id).subscribe({
        next: () => {
          this.myProperties = this.myProperties.filter(p => p.id !== id);
        },
        error: (err) => console.error('Hiba a törlés során:', err)
      });
    }
  }
}