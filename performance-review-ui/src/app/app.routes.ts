import { Routes } from '@angular/router';
import { RegisterUserComponent } from './account/register-user/register-user.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginComponent } from './account/login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
    // Redirect empty path to login
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'login'
    },
  
    // Login Layout
    {
      path: 'login',
      component: LoginLayoutComponent,
      children: [
        {
          path: '',
          component: LoginComponent
        }
      ]
    },
  
    // Main Layout (Protected Routes After Login)
    {
      path: '',
      component: MainLayoutComponent, // Wrap logged-in views in MainLayoutComponent
     
      children: [
        
        {
          path: 'account/register',
          component: RegisterUserComponent
        }
      ]
    },
  
    // Wildcard Route: Redirect unknown routes to login
    {
      path: '**',
      redirectTo: 'login'
    }
  ];
  