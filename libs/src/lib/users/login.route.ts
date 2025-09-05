import { Routes } from '@angular/router';
export const MY_LIB_ROUTES: Routes = [
  {
    path:'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },

]
