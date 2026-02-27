import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css',
    '../../shared/styles/dashboard.css'
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutComponent implements OnInit {

  isLoggedIn = false;
  userRole: string | null = null;
  username: string | null = null;



  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: any) => {
      });this.hasRole
  }

  ngOnInit(): void {
    this.refreshUserState();
  }

  refreshUserState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.role;
    this.username = this.authService.getUsernameFromToken();
    /*this.isLoggedIn = true;
    this.userRole = 'Host'; 
    this.username = 'Teszt Elek';*/
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole ?? '');
  }
}
