import { Route } from '@angular/router';
import { accueilResolver } from './shared/resolvers/accueil-resolver';
import { slugResolver } from './shared/resolvers/slug-resolver';
import { sousrubriqueRubriqueResolver } from './shared/resolvers/sousrubrique-rubrique-resolver';
import { videoResolver } from './shared/resolvers/video-resolver';

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
        resolve: { accueilList: accueilResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'video/:video',
        loadComponent:()=>import('./pages/video/video.component').then((m)=>m.VideoComponent),
        resolve: { videoList: videoResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'contact/:contact',
        loadComponent:()=>import('./pages/contact/contact.component').then((m)=>m.ContactComponent),

      },
      {
        path: ':rubrique/:sousrubrique/:slug',
        loadComponent:()=>import('./pages/article/article.component').then((m)=>m.ArticleComponent),
        resolve:{articleSlug:slugResolver},
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':rubrique/:sousrubrique',
        loadComponent:()=>import('./pages/rubrique-article/rubrique-article.component').then((m)=>m.RubriqueArticleComponent),
        resolve: { menuList: sousrubriqueRubriqueResolver },
        runGuardsAndResolvers: 'always'
      },


    ]
  }
];
