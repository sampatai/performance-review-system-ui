import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { ROUTES } from './shared/constants/route.constants.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTES.LOGIN,
  },
  {
    path: ROUTES.LOGIN,
    loadComponent: () =>
      import('./login-layout/login-layout.component').then(m => m.LoginLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./account/login/login.component').then(m => m.LoginComponent),
      },
    ],
  },
  {
    path: '',
     data: { roles: ['Admin','Manager'], title: 'Dashboard' },

    loadComponent: () =>
      import('./main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTES.DASHBOARD,
      },
      {
        path: ROUTES.DASHBOARD,
        data: { roles: ['Admin','Manager'], title: 'Dashboard' },
        
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: ROUTES.ACCOUNT.REGISTER,
        data: { roles: ['Admin','Manager'], title: 'Register User' },

        loadComponent: () =>
          import('./account/register-user/register-user.component').then(m => m.RegisterUserComponent),
      },
      {
        path: ROUTES.STAFF,
        data: { roles:['Admin','Manager'], title: 'List Staff' },

        loadComponent: () =>
          import('./account/list-user/list-user.component').then(m => m.ListUserComponent),
      },
      {
        path: ROUTES.ACCOUNT.EDIT,
        data: { roles: ['Admin','Manager'], title: 'Edit User' },

        loadComponent: () =>
          import('./account/edit-user/edit-user.component').then(m => m.EditUserComponent),
      },
      {
        
        path: ROUTES.EVALUATION_FORM.TEMPLATE,
        data: { roles: ['Admin','Manager'], title: 'Template List' },

        loadComponent: () =>
          import('./evaluationform/evaluation-form-list/evaluation-form-list.component').then(
            m => m.EvaluationFormListComponent
          ),
      },
      {
        path: ROUTES.EVALUATION_FORM.CREATE,
        data: { roles: ['Admin','Manager'], title: 'Create Evaluation Form' },

        loadComponent: () =>
          import('./evaluationform/create-evaluation-form/create-evaluation-form.component').then(
            m => m.CreateEvaluationFormComponent
          ),
      },
      {
        path: ROUTES.EVALUATION_FORM.EDIT,
        data: { roles: ['Admin','Manager'], title: 'Edit Evaluation Form' },
        loadComponent: () =>
          import('./evaluationform/edit-evaluation-form/edit-evaluation-form.component').then(
            m => m.EditEvaluationFormComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: ROUTES.LOGIN,
  },
];