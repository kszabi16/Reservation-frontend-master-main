import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (expectedRole?: string): CanActivateFn => {

  return (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.role; // lehet null is (anonymous)
    const url = route.routeConfig?.path;

    // -------------------------------
    // 1) User dashboard speciális szabály
    // -------------------------------
    if (url === 'user-dashboard') {
      // anonymous és "User" role MEHET
      if (!userRole || userRole === 'User') {
        return true;
      }

      // Host és Admin NEM mehet
      if (userRole === 'Admin') return router.parseUrl('/admin-dashboard');
      if (userRole === 'Host') return router.parseUrl('/host-dashboard');

      return false;
    }

    // -------------------------------
    // 2) Ha nincs expectedRole → csak login védelem (anon tiltva)
    // -------------------------------
    if (!expectedRole) {
      if (authService.isLoggedIn()) return true;
      return router.parseUrl('/login');
    }

    // -------------------------------
    // 3) Kötelező szerepkör ellenőrzés
    // -------------------------------
    if (!authService.isLoggedIn()) {
      return router.parseUrl('/login');
    }

    if (userRole === expectedRole) {
      return true;
    }

    // -------------------------------
    // 4) Hibás szerepkör → saját dashboard
    // -------------------------------
    if (userRole === 'Admin') return router.parseUrl('/admin-dashboard');
    if (userRole === 'Host') return router.parseUrl('/host-dashboard');
    if (userRole === 'User') return router.parseUrl('/user-dashboard');

    authService.logout();
    return router.parseUrl('/login');
  };
};

