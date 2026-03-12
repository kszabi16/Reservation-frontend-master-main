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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl:'./admin-user-create.css'
})
export class AdminUserCreateComponent {

  userData = {
    username: '',
    email: '',
    password: '',
    role: 'Guest' 
  };
  
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  successMessage = '';

  onSubmit(): void {
    if (!this.userData.username || !this.userData.email || !this.userData.password) {
      this.error = 'Kérlek, tölts ki minden kötelező mezőt!';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.userService.createUser(this.userData).subscribe({
      next: () => {
        this.successMessage = 'Felhasználó sikeresen létrehozva!';
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/admin-users']);
        }, 2000);
      },
      error: (err) => {
        console.error('Hiba a mentés során:', err);
        this.loading = false;

        
        if (err.error && err.error.message) {
          
          if (err.error.message.includes('Email')) {
            this.error = 'Ez az e-mail cím már foglalt! Kérlek, válassz másikat.';
          } 
          else if (err.error.message.includes('Username')) {
            this.error = 'Ez a felhasználónév már foglalt! Kérlek, válassz másikat.';
          } 
          else {
            this.error = err.error.message;
          }

        } else {
       
          this.error = 'Szerver hiba történt a felhasználó létrehozásakor.';
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin-users']);
  }
}