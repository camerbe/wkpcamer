import { Route } from '@angular/router';
import { accueilResolver } from './shared/resolvers/accueil-resolver';
import { slugResolver } from './shared/resolvers/slug-resolver';

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
      {
        path: ':rubrique/:sousrubrique/:slug',
        loadComponent:()=>import('./pages/article/article.component').then((m)=>m.ArticleComponent),
        resolve:{articleSlug:slugResolver}
      }


    ]
  }
];
