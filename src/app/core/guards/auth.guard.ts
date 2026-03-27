import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (expectedRole?: string): CanActivateFn => {
  return (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.role;
    const isLoggedIn = authService.isLoggedIn();

    if (!isLoggedIn) {
      return router.parseUrl('/public-dashboard');
    }

    if (!expectedRole) {
      return true;
    }

    if (userRole === expectedRole) {
      return true;
    }

    if (userRole === 'Admin') return router.parseUrl('/admin-dashboard');
    if (userRole === 'Host') return router.parseUrl('/host-dashboard');
    if (userRole === 'Guest') return router.parseUrl('/user-dashboard');

    authService.logout();
    return router.parseUrl('/public-dashboard');
  };
};