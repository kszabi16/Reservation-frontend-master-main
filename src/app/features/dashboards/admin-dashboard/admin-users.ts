import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { UserDto } from '../../../core/models/user-dto';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './admin-users.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAdminComponent implements OnInit {
  users: UserDto[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba a felhasználók betöltésekor:', err);
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if(confirm('VIGYÁZAT! Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem vonható vissza!')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          // Sikeres törlés után kivesszük a listából
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err) => console.error('Hiba a törlés során:', err)
      });
    }
  }

  changeRole(user: UserDto, newRole: string): void {
    if(confirm(`Biztosan módosítod a felhasználó szerepkörét erre: ${newRole}?`)) {
      
      // Valós hívás a backend felé (amit az előbb írtunk a UserService-be)
      this.userService.updateUserRole(user.id, newRole).subscribe({
        next: () => {
          // Ha a szerver sikeresen válaszolt, a felületen is frissítjük az értéket.
          // Az 'as any' azért kell, hogy a TypeScript ne panaszkodjon a pontos Guest/Host/Admin típus miatt.
          user.role = newRole as any; 
          alert('Szerepkör sikeresen frissítve!');
        },
        error: (err) => {
          console.error('Hiba a szerepkör frissítésekor:', err);
          alert('Szerver hiba: Nem sikerült frissíteni a szerepkört.');
          // Hiba esetén visszatöltjük az eredeti adatokat az adatbázisból, hogy a legördülő menü visszaálljon
          this.loadUsers(); 
        }
      });

    } else {
      // Ha a felugró ablakban a "Mégsem"-re nyomott, visszaállítjuk a select mezőt
      this.loadUsers(); 
    }
  }

  // 3. A megírt addUser metódus
  addUser(): void {
    
    this.router.navigate(['/admin-user-create']);
  }
}