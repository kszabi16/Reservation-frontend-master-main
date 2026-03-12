import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../../../core/services/property.service';

@Component({
  selector: 'admin-pending-properties',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-pending-properties.html',
  styleUrl: './admin-pending-properties.css'
})
export class AdminPendingPropertiesComponent implements OnInit {
  pendingProperties: any[] = [];
  loading = true;

  showConfirmModal = false;
  propertyToApprove: any = null;
  isApproving = false;
  showSuccessToast = false;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.loading = true;
    this.propertyService.getPendingProperties().subscribe({
      next: (data) => {
        this.pendingProperties = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openApproveModal(property: any) {
    this.propertyToApprove = property;
    this.showConfirmModal = true;
  }

  cancelApproval() {
    this.showConfirmModal = false;
    this.propertyToApprove = null;
  }

  confirmApproval() {
    if (!this.propertyToApprove) return;
    this.isApproving = true;
    this.propertyService.approveProperty(this.propertyToApprove.id).subscribe({
      next: () => {
     
        this.pendingProperties = this.pendingProperties.filter(p => p.id !== this.propertyToApprove.id);
        this.isApproving = false;
        this.showConfirmModal = false;
        this.propertyToApprove = null;
        this.showSuccessToast = true;
        setTimeout(() => this.showSuccessToast = false, 3000);
      },
      error: (err) => {
        console.error(err);
        this.isApproving = false;
      }
    });
  }
}