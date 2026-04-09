import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { MiniLayoutComponent } from './features/mini-sidebar/mini-sidebar';

export const routes: Routes = [
  // Publikus oldalak
  { path: '', pathMatch: 'full', redirectTo: 'public-dashboard' },

  {
    path: 'auth',
    component: MiniLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      
      // PUBLIKUS
      {
        path: 'public-dashboard',
        loadComponent: () =>
          import('./features/dashboards/public-dashboard/public-dashboard').then((m) => m.PublicDashboardComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
      },

      //KÖZÖS BEJELENTKEZETT
      {
        path: 'profile',
        canActivate: [authGuard()],
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'favorites',
        canActivate: [authGuard()],
        loadComponent: () =>
          import('./features/favorites/user-favorites').then((m) => m.UserFavoritesComponent),
      },
      {
        path: 'my-bookings',
        canActivate: [authGuard()],
        loadComponent: () =>
          import('./features/bookings/booking-list-component/booking-list-component').then((m) => m.BookingListComponent),
      },
      {
        path: 'bookings-create',
        canActivate: [authGuard()],
        loadComponent: () =>
          import('./features/bookings/booking-create-component/booking-create-component').then((m) => m.BookingCreateComponent),
      },
      {
        path: 'bookings-list',
        canActivate: [authGuard()],
        loadComponent: () =>
          import('./features/bookings/booking-list-component/booking-list-component').then((m) => m.BookingListComponent),
      },
      {
        path: 'property/create',
        canActivate: [authGuard()],
        loadComponent: () => 
          import('./features/properties/property-create/property-create.component').then((m) => m.PropertyCreateComponent),
      },
      {
        path: 'user-dashboard',
        canActivate: [authGuard()], 
        loadComponent: () =>
          import('./features/dashboards/user-dashboard/user-dashboard').then((m) => m.UserDashboardComponent),
      },


      //HOST (HÁZIGAZDA) SPECIFIKUS 
      {
        path: 'host-dashboard',
        canActivate: [authGuard('Host')],
        loadComponent: () =>
          import('./features/dashboards/host-dashboard/host-dashboard').then((m) => m.HostDashboardComponent),
      },
      {
        path: 'host-all-properties',
        canActivate: [authGuard('Host')],
        loadComponent: () =>
          import('./features/dashboards/host-dashboard/host-all-properties/host-all-properties').then((m) => m.HostAllPropertiesComponent),
      },
      {
        path: 'host-bookings',
        canActivate: [authGuard('Host')],
        loadComponent: () =>
          import('./features/bookings/booking-host-component/booking-host-component').then((m) => m.BookingHostComponent),
      },
      {
        path: 'bookings-host',
        canActivate: [authGuard('Host')],
        loadComponent: () =>
          import('./features/bookings/booking-host-component/booking-host-component').then((m) => m.BookingHostComponent),
      },
      {
        path: 'property/edit/:id',
        canActivate: [authGuard('Host')],
        loadComponent: () => 
          import('./features/properties/property-edit/property-edit.component').then((m) => m.PropertyEditComponent),
      },

      // ADMIN 
      {
        path: 'admin-dashboard',
        canActivate: [authGuard('Admin')], 
        loadComponent: () =>
          import('./features/dashboards/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'admin-user-create',
        canActivate: [authGuard('Admin')],
        loadComponent: () => 
          import('./features/dashboards/admin-dashboard/admin-user-create/admin-user-create').then(m => m.AdminUserCreateComponent),
      },
      {
        path: 'admin-users', 
        canActivate: [authGuard('Admin')],
        loadComponent: () => 
          import('./features/dashboards/admin-dashboard/admin-users/admin-users').then(m => m.UserAdminComponent),
      },
      { 
        path: 'admin-stats',
        canActivate: [authGuard('Admin')],
        loadComponent: () => import('./features/dashboards/admin-dashboard/admin-stats/admin-stats').then(m => m.AdminStatsComponent),
      },
      {
        path:'admin/pending-properties',
        canActivate: [authGuard('Admin')],
        loadComponent: () => import('./features/dashboards/admin-dashboard/admin-pending-properties/admin-pending-properties').then(m=>m.AdminPendingPropertiesComponent),
      },
      {
        path: 'bookings-admin',
        canActivate: [authGuard('Admin')],
        loadComponent: () =>
          import('./features/bookings/booking-admin-component/booking-admin-component').then((m) => m.BookingAdminComponent),
      },
      {
        path: 'host-requests',
        canActivate: [authGuard('Admin')],
        loadComponent: () =>
          import('./features/host-requests/host-request-admin.component').then((m) => m.HostRequestAdminComponent),
      },
      {
        path: 'property/admin',
        canActivate: [authGuard('Admin')],
        loadComponent: () => import('./features/properties/property-admin/property-admin.component').then((m) => m.PropertyAdminComponent),
      },
      {
        path: "logs",
        canActivate: [authGuard('Admin')],
        loadComponent: () => import('./features/dashboards/admin-dashboard/admin-logs/admin-logs').then(m => m.AdminLogs),
      } ,
      {
        path: 'property/:id',
        loadComponent: () =>
          import('./features/properties/property-detail/property-detail').then((m) => m.PropertyPublicDetailComponent),
      },
      
    ],
  },

  // 404 fallback
  { path: '**', redirectTo: 'public-dashboard' },
];