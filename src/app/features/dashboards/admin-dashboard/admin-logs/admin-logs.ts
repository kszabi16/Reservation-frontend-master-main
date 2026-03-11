import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LogService, SystemLogDto } from '../../../../core/services/log.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-logs.html'
})
export class AdminLogs implements OnInit {
  logs: SystemLogDto[] = [];
  loading = true;

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.logService.getLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba a naplók betöltésekor:', err);
        this.loading = false;
      }
    });
  }
}