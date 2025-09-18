import { Routes } from '@angular/router';
import { changePasswordResolver } from './resolvers/change-password-resolver';
export const MY_LIB_ROUTES: Routes = [
  {
    path:'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path:'changepw/:email',
    loadComponent: () => import('./pages/login/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
    resolve:{user:changePasswordResolver},
  },

]
