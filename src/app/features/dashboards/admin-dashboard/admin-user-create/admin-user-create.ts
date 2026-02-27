import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user-service';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-user-create.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminUserCreateComponent {
  
  // Az űrlap adatai
  userData = {
    username: '',
    email: '',
    password: '',
    role: 'Guest' // Alapértelmezett szerepkör
  };
  
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.userData.username || !this.userData.email || !this.userData.password) {
      this.error = 'Kérlek, tölts ki minden kötelező mezőt!';
      return;
    }

    this.loading = true;
    this.error = '';

    this.userService.createUser(this.userData).subscribe({
      next: () => {
        alert('Felhasználó sikeresen létrehozva!');
        // Visszairányítjuk a listához
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('Hiba a mentés során:', err);
        this.error = 'Szerver hiba történt a felhasználó létrehozásakor.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}