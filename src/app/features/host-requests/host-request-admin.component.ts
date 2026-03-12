import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostRequestService } from '../../core/services/host-request.service';
import { HostRequestDto } from '../../core/models/host-request-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-host-request-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-request-admin.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl:'./host-request-admin.component.css'
})
export class HostRequestAdminComponent implements OnInit {
  requests: HostRequestDto[] = [];
  loading = true;
  error = '';

  // Modal és folyamat változók
  selectedRequest: HostRequestDto | null = null;
  showApproveModal = false;
  showRejectModal = false;
  isProcessing = false;

  // Toast értesítés
  showSuccessToast = false;
  toastMessage = '';

  constructor(private hostRequestService: HostRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';
    this.hostRequestService.getPendingRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba a kérelmek betöltésekor:', err);
        this.error = 'Nem sikerült betölteni a kérelmeket a szerverről.';
        this.loading = false;
      }
    });
  }

  // --- JÓVÁHAGYÁS ---
  openApproveModal(request: HostRequestDto): void {
    this.selectedRequest = request;
    this.showApproveModal = true;
  }

  confirmApprove(): void {
    if (!this.selectedRequest) return;
    this.isProcessing = true;

    this.hostRequestService.approveRequest(this.selectedRequest.id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== this.selectedRequest!.id);
        this.showToast('Kérelem sikeresen jóváhagyva! A felhasználó mostantól Host.');
        this.closeModals();
      },
      error: (err) => {
        console.error('Hiba a jóváhagyás során:', err);
        alert('Szerverhiba történt a jóváhagyás során.');
        this.isProcessing = false;
      }
    });
  }

  // --- ELUTASÍTÁS ---
  openRejectModal(request: HostRequestDto): void {
    this.selectedRequest = request;
    this.showRejectModal = true;
  }

  confirmReject(): void {
    if (!this.selectedRequest) return;
    this.isProcessing = true;

    this.hostRequestService.rejectRequest(this.selectedRequest.id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== this.selectedRequest!.id);
        this.showToast('Kérelem sikeresen elutasítva.');
        this.closeModals();
      },
      error: (err) => {
        console.error('Hiba az elutasítás során:', err);
        alert('Szerverhiba történt az elutasítás során.');
        this.isProcessing = false;
      }
    });
  }

  // --- SEGÉDMETÓDUSOK ---
  closeModals(): void {
    this.showApproveModal = false;
    this.showRejectModal = false;
    this.selectedRequest = null;
    this.isProcessing = false;
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.showSuccessToast = true;
    setTimeout(() => this.showSuccessToast = false, 3000);
  }
}