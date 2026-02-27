import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginDto } from '../../../core/models/auth-dto'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup<{
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
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    });
  }

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

    const payload: LoginDto = {
      Email: this.form.value.email!,
      Password: this.form.value.password!
    };

    this.authService.login(payload).subscribe({
  next: (response) => {
    localStorage.setItem('token', response.token);

    const role = this.authService.role;

    if (role === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'Host') {
      this.router.navigate(['/host-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']); // anonymous user is ide megy
    }

    this.loading = false;
  },
  error: (err) => {
    console.error(err);
    if (err.status === 0) {
      this.error = 'Nem sikerült csatlakozni a szerverhez.';
    } else if (err.error?.message) {
      this.error = err.error.message;
    } else {
      this.error = 'Hibás e-mail cím vagy jelszó.';
    }
    this.loading = false;
  }
});

  }
}
