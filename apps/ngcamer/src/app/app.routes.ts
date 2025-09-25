import { Route } from '@angular/router';
import { accueilResolver } from './shared/resolvers/accueil-resolver';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  {
    path:'',
    loadComponent:()=>import('./pages/layout/layout.component').then((m)=>m.LayoutComponent),
    children:[
      {
        path: 'accueil',
        loadComponent:()=>import('./pages/home/home.component').then((m)=>m.HomeComponent),
        //component: HomeComponent,
        resolve: { accueilList: accueilResolver }
      },


    ]
  }
];
