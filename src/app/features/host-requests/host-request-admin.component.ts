import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostRequestService} from '../../core/services/host-request.service';
import { HostRequestDto } from '../../core/models/host-request-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-host-request-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './host-request-admin.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HostRequestAdminComponent implements OnInit {
  requests: HostRequestDto[] = [];
  loading = true;
  error = '';

  constructor(private hostRequestService: HostRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.hostRequestService.getPendingRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Nem sikerült betölteni a kérelmeket.';
        this.loading = false;
      }
    });
  }

  approveRequest(id: number): void {
  this.hostRequestService.approveRequest(id).subscribe({
    next: () => {
      this.requests = this.requests.filter(r => r.id !== id);
    }
  });
}

rejectRequest(id: number): void {
  this.hostRequestService.rejectRequest(id).subscribe({
    next: () => {
      this.requests = this.requests.filter(r => r.id !== id);
    }
  });
}
}
