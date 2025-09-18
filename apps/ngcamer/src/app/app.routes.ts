import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path:'home',
    loadComponent:()=>import('./pages/layout/layout.component').then((m)=>m.LayoutComponent)
  }
];
