import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { PropertyDto } from '../../../core/models/property-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-property-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-admin.component.html',
  styleUrl:'../properties.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyAdminComponent implements OnInit {
  properties: PropertyDto[] = [];
  loading = false;
  error = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.propertyService.getAllPropertiesForAdmin().subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nem sikerült betölteni az ingatlanokat.';
        this.loading = false;
      }
    });
  }

  deleteProperty(id: number): void {
    if (!confirm('Biztosan törölni szeretnéd ezt az ingatlant?')) return;

    this.propertyService.deleteProperty(id).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== id);
      },
      error: () => {
        alert('Nem sikerült törölni az ingatlant.');
      }
    });
  }
}
