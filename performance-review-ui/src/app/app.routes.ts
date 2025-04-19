import { Routes } from '@angular/router';
import { RegisterUserComponent } from './account/register-user/register-user.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginComponent } from './account/login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { ListUserComponent } from './account/list-user/list-user.component';

export const routes: Routes = [
  // Redirect empty path to login if not logged in
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login', // Redirect to login if no valid path is found
  },

  // Login Layout (can also handle login form)
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
    ],
  },

  // Main Layout (Protected Routes After Login)
  {
    path: '', // Protected routes under main layout (will redirect to dashboard)
    component: MainLayoutComponent,
    canActivate: [authGuard], // Protect these routes
    children: [
      {
        path: '', // Empty path here means default route after login
        pathMatch: 'full',
        redirectTo: 'dashboard', // Default route after login
      },
      {
        path: 'dashboard', // Dashboard route (or any page you want to show post-login)
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ), // Lazy loading for dashboard
      },
      {
        path: 'account/register', // Registration route
        component: RegisterUserComponent,
        title: 'Register User',
      },
      {
        path: 'staff/list', // Registration route
        component: ListUserComponent,
        title: 'List User',
      },
      {
        path: 'account/edit-user/:id',
        loadComponent: () =>
          import('./account/edit-user/edit-user.component').then(
            (m) => m.EditUserComponent
          ),
          title: 'Edit User',
      },
    ],
  },

  // Wildcard Route: Redirect unknown routes to login
  {
    path: '**',
    redirectTo: 'login',
  },
];
