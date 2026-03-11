import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { UserDto } from '../../../core/models/user-dto'

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
  
  showConfirmModal = false;
  pendingRoleChange: { user: UserDto, newRole: string } | null = null;

  showSuccessModal = false;
  successMessage = '';

  showEditModal = false;
  editingUser: any = null; 
  isSaving = false; 

  showDeleteModal = false;
  userToDelete: any = null;
  isDeleting = false;

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
  openEditModal(user: UserDto): void {
    this.editingUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' 
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingUser = null;
  }

  saveEditedUser(): void {
    if (!this.editingUser.username || !this.editingUser.email) {
      alert('A név és az e-mail cím megadása kötelező!');
      return;
    }

    this.isSaving = true;
    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === this.editingUser.id);
        if (index > -1) {
          this.users[index] = updatedUser; 
        }
        this.successMessage = 'A felhasználó adatai sikeresen frissültek!';
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);

        this.closeEditModal();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Hiba szerkesztéskor:', err);
        alert('Szerverhiba történt! Lehet, hogy az email vagy név már foglalt.');
        this.isSaving = false;
      }
    });
  }
  openDeleteModal(user: any): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }
  

  confirmDelete(): void {
    if (!this.userToDelete) return;
    this.isDeleting = true;

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.userToDelete.id);
        this.successMessage = 'A felhasználó sikeresen törölve lett!';
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);

        this.isDeleting = false;
        this.showDeleteModal = false;
        this.userToDelete = null;
      },
      error: (err) => {
        console.error('Hiba a törlés során:', err);
        alert('Szerverhiba: Nem sikerült törölni a felhasználót.');
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.userToDelete = null;
      }
    });
  }

  changeRole(user: UserDto, newRole: string): void {
    if (user.role === newRole) return;

    this.pendingRoleChange = { user, newRole };
    this.showConfirmModal = true;
  }

 
  confirmRoleChange(): void {
    if (!this.pendingRoleChange) return;

    const { user, newRole } = this.pendingRoleChange;
    this.showConfirmModal = false;

    this.userService.updateUserRole(user.id, newRole ).subscribe({
      next: () => {
        user.role = newRole as any; 
        this.successMessage = `A felhasználó (${user.username}) szerepköre sikeresen módosítva: ${newRole}.`;
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);
      },
      error: (err) => {
        console.error('Hiba a szerepkör frissítésekor:', err);
        this.loadUsers(); 
        alert('Szerverhiba történt a szerepkör módosításakor.'); 
      },
      complete: () => {
         this.pendingRoleChange = null;
      }
    });
  }

  cancelRoleChange(): void {
    this.showConfirmModal = false; 
    this.pendingRoleChange = null;
    this.loadUsers(); 
  }

  addUser(): void {
    this.router.navigate(['/admin-user-create']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/admin-user-edit', userId]);
  }
  toggleTrusted(user: any) {
  this.userService.toggleTrustedHost(user.id).subscribe({
    next: () => {
      user.isTrustedHost = !user.isTrustedHost; // Felület frissítése
      alert(`${user.username} státusza sikeresen módosítva!`);
    },
    error: (err) => console.error(err)
  });
}
}