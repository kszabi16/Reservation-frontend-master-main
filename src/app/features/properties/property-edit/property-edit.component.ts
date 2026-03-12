import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { CreatePropertyDto } from '../../../core/models/property-dto';
import { PropertyDto } from '../../../core/models/property-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './property-edit.component.html',
  styleUrl: './property-edit.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyEditComponent implements OnInit {
  form!: FormGroup;
  propertyId!: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadProperty();
  }

  initForm(): void {
    this.form = this.fb.group({
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      Location: ['', Validators.required],
      PricePerNight: [0, [Validators.required, Validators.min(1)]],
      Capacity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  loadProperty(): void {
    this.loading = true;
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (data: any) => {
        // Itt manuálisan összekötjük a nagybetűs űrlapot a kisbetűs JSON adatokkal!
        this.form.patchValue({
          Title: data.title || data.Title, 
          Description: data.description || data.Description,
          Location: data.location || data.Location,
          PricePerNight: data.pricePerNight || data.PricePerNight,
          Capacity: data.capacity || data.Capacity
        });
        
        this.loading = false;
      },
      error: () => {
        this.error = 'Nem sikerült betölteni az ingatlant.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const dto: CreatePropertyDto = this.form.value;

    this.propertyService.updateProperty(this.propertyId, dto).subscribe({
      next: () => {
        // IDE ÍRTUK BE AZ ÚJ IRÁNYT:
        this.router.navigate(['/property/admin']);
      },
      error: () => {
        this.error = 'Nem sikerült frissíteni az ingatlant.';
        this.loading = false;
      }
    });
  }
}
