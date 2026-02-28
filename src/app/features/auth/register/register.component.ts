import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
 form: FormGroup<{
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}>;

  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)])
    });
  }

  // 💡 ettől működik a sablonban a f.username, f.email stb.
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error = 'Kérlek, töltsd ki helyesen az űrlapot.';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = {
      Username: this.form.value.username!,
      Email: this.form.value.email!,
      Password: this.form.value.password!
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
     error: (err) => {
        console.error(err);
        if (err.status === 0) {
          this.error = 'Nem sikerült csatlakozni a szerverhez.';
        } else if (err.error?.message) {
          // Magyarosítjuk az angol backend hibaüzeneteket
          if (err.error.message.includes('Email')) {
            this.error = 'Ez az e-mail cím már foglalt! Kérlek, jelentkezz be, vagy használj másikat.';
          } else if (err.error.message.includes('Username')) {
            this.error = 'Ez a felhasználónév már foglalt! Kérlek, válassz másikat.';
          } else {
            this.error = err.error.message; // Bármilyen egyéb üzenet
          }
        } else {
          this.error = 'A regisztráció nem sikerült. Ellenőrizd az adatokat.';
        }
        this.loading = false;
      }
    });
  }
}
