import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../../core/services/user-service';
import { UserDto, UpdateUserProfileDto } from '../../core/models/user-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileComponent implements OnInit {
  user: UserDto | null = null;
  
  loading = true;
  saving = false;
  message: { type: 'success' | 'error', text: string } | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.showMessage('error', 'Nem sikerült betölteni a profilt.');
      }
    });
  }

  saveProfile(): void {
    if (!this.user) return;
    this.saving = true;
    this.message = null;

    
    const updateDto: UpdateUserProfileDto = {
      username: this.user.username,
      phoneNumber: this.user.phoneNumber,
      location: this.user.location,
      bio: this.user.bio
    };

    this.userService.updateProfile(updateDto).subscribe({
      next: (updatedUser) => {
        
        this.saving = false;
        this.showMessage('success', 'A profil adatok sikeresen mentve!');
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.showMessage('error', 'Hiba történt a mentés során.');
      }
    });
  }

  
  showMessage(type: 'success' | 'error', text: string) {
    this.message = { type, text };
   
    setTimeout(() => this.message = null, 3000);
  }
}