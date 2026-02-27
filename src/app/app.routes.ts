import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { MiniLayoutComponent } from './features/mini-sidebar/mini-sidebar';

// Property modul komponensek
import { PropertyCreateComponent } from './features/properties/property-create/property-create.component';
import { PropertyEditComponent } from './features/properties/property-edit/property-edit.component';
import { PropertyAdminComponent } from './features/properties/property-admin/property-admin.component';
import { UserAdminComponent } from './features/dashboards/admin-dashboard/admin-users';

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


  // Layout alatti oldalak
  {
    path: '',
    component: LayoutComponent,
    children: [

      
      // PUBLIC + USER dashboard
      {
        path: 'public-dashboard',
        loadComponent: () =>
          import('./features/dashboards/public-dashboard/public-dashboard').then(
            (m) => m.PublicDashboardComponent
          ),
      },

      {
        path: 'bookings-create',
        //canActivate: [authGuard('User','Host')],
        loadComponent: () =>
          import('./features/bookings/booking-create-component/booking-create-component').then(
            (m) => m.BookingCreateComponent
          ),
       
      },
        {
        path: 'bookings-list',
        //canActivate: [authGuard('User')],
        loadComponent: () =>
          import('./features/bookings/booking-list-component/booking-list-component').then(
            (m) => m.BookingListComponent
          ),
       
      },
        {
        path: 'bookings-admin',
        //canActivate: [authGuard('Admin')],
        loadComponent: () =>
          import('./features/bookings/booking-admin-component/booking-admin-component').then(
            (m) => m.BookingAdminComponent
          ),
       
      },
        {
        path: 'bookings-host',
        //canActivate: [authGuard('Admin','Host')],
        loadComponent: () =>
          import('./features/bookings/booking-host-component/booking-host-component').then(
            (m) => m.BookingHostComponent
          ),
       
      },
      
      {
        path: 'user-dashboard',
        //canActivate: [authGuard('User')],
        loadComponent: () =>
          import('./features/dashboards/user-dashboard/user-dashboard').then(
            (m) => m.UserDashboardComponent
          ),
        // nincs guard → anonymous is mehet
      },{
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      
      {
        path: 'messages', 
        //canActivate: [authGuard('User,Host')],
        loadComponent: () =>
          import('./features/messages/messages.component').then(
            (m) => m.MessagesComponent
          ),
      },
      {
        path: 'calendar',
        //canActivate: [authGuard('User,Host')],
        loadComponent: () =>
          import('./features/calendar/calendar.component').then(
            (m) => m.CalendarComponent
          ),
      },
       {
        path: 'property/create',
          loadComponent: () => import('./features/properties/property-create/property-create.component').then(
            (m) => m.PropertyCreateComponent
          ),
        //canActivate: [authGuard('User,Host')],
      },
      {
        path: 'property/edit/:id',
        loadComponent: () => import('./features/properties/property-edit/property-edit.component').then(
          (m) => m.PropertyEditComponent
        ),
        //canActivate: [authGuard('Host')],
      },
      {
        path: 'property/admin',
        loadComponent: () => import('./features/properties/property-admin/property-admin.component').then(
          (m) => m.PropertyAdminComponent
        ),
        //canActivate: [authGuard('Admin')],
      },
      {
        path: 'property/:id',
        loadComponent: () =>
          import('./features/properties/property-detail/property-public-detail.component').then(
            (m) => m.PropertyPublicDetailComponent
          ),
      },

      // HOST dashboard
      {
        path: 'host-dashboard',
        //canActivate: [authGuard('Host')],
        loadComponent: () =>
          import('./features/dashboards/host-dashboard/host-dashboard').then(
            (m) => m.HostDashboardComponent
          ),
      },
      {
        path: 'host-all-properties',
        //canActivate: [authGuard('Host')],
        loadComponent: () =>
          import('./features/dashboards/host-dashboard/host-all-properties').then(
            (m) => m.HostAllPropertiesComponent
          ),
      },
      {
      path: 'host-bookings',
      //canActivate: [authGuard('Host')],
      loadComponent: () =>
        import('./features/bookings/booking-host-component/booking-host-component').then(
          (m) => m.BookingHostComponent
        ),
      },
      // Admin-only
      {
        path: 'host-requests',
        //canActivate: [authGuard('Admin')],
        loadComponent: () =>
          import('./features/host-requests/host-request-admin.component').then(
            (m) => m.HostRequestAdminComponent
          ),
      },
      {
        path: 'admin-user-create',
        loadComponent: () => 
          import('./features/dashboards/admin-dashboard/admin-user-create/admin-user-create')
        .then(m => m.AdminUserCreateComponent)
      },
      {path: 'admin-users', 
        loadComponent: () => 
          import('./features/dashboards/admin-dashboard/admin-users')
        .then(m => m.UserAdminComponent)},
      { 
        path: 'admin-stats',
         loadComponent() {
          return import('./features/dashboards/admin-dashboard/admin-stats')
          .then(m => m.AdminStatsComponent);
         }

      },
      {
        path: 'admin-dashboard',
        //canActivate: [authGuard('Admin')],
        loadComponent: () =>
          import('./features/dashboards/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboardComponent
          ),
      },

      // profile (logged-in bármelyik user)
      {
        path: 'profile',
        //canActivate: [authGuard()],
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },

      // properties oldal (host/admin)
 
      
      
    ],
  },

  // 404 fallback
  { path: '**', redirectTo: 'public-dashboard' },
];

