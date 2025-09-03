import { articleResolver } from './shared/resolvers/article-resolver';
import { articleListResolver } from './../../../../libs/articles/article-list-resolver';
import { Route } from '@angular/router';
import { AuthGard } from './guards/auth-gard';
import { adminGuard } from './guards/admin-guard';
import { dimensionListResolver } from './shared/resolvers/dimension-list-resolver';
import { dimensionResolver } from './shared/resolvers/dimension-resolver';
import { eventListResolver } from './shared/resolvers/event-list-resolver';


export const appRoutes: Route[] = [
  {
    path:'',
    loadChildren:()=> import('@wkpcamer/users').then((m) => m.MY_LIB_ROUTES),
  },
  {

    path: 'admin',
    canActivate:[AuthGard],
    loadComponent: () => import('./shared/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'user',
        canActivate:[adminGuard],
        loadComponent: () => import('./pages/user/user').then((m) => m.User)
      },
      {
        path: 'article',
        loadComponent: () => import('./pages/article/article').then((m) => m.ArticleListComponent),
        resolve: { ArticleItem: articleListResolver }
      },
      {
        path: 'article/show/:id',
        loadComponent: () => import('./pages/article/article-form/article-form').then((m) => m.ArticleFormComponent),
        resolve: { article: articleResolver }
      },
      {
        path: 'article/form',
        loadComponent: () => import('./pages/article/article-form/article-form').then((m) => m.ArticleFormComponent),


      },
      {
        path: 'dimension/show/:id',
        loadComponent: () => import('./pages/dimension/dimension-form.component').then((m) => m.DimensionFormComponent),
        resolve:{dimension:dimensionResolver},
        canActivate:[adminGuard]
      },
      {
        path: 'dimension/form',
        loadComponent: () => import('./pages/dimension/dimension-form.component').then((m) => m.DimensionFormComponent),
        canActivate:[adminGuard]
      },
      {
        path: 'dimension',
        loadComponent: () => import('./pages/dimension/dimension.component').then((m) => m.DimensionListComponent),
        resolve:{dimensions:dimensionListResolver},
        canActivate:[adminGuard]
      },
      {
        path: 'event',
        loadComponent: () => import('./pages/event/event-list.component').then((m) => m.EventListComponent),
         resolve:{events:eventListResolver},
      },
      {
        path: 'event/form',
        loadComponent: () => import('./pages/event/event-form.component').then((m) => m.EventFormComponent)
      },
      {
        path: 'pub',
        loadComponent: () => import('./pages/pub/pub').then((m) => m.Pub)
      },
      {
        path: 'typepub',
        loadComponent: () => import('./pages/typepub/typepub').then((m) => m.Typepub)
      },
      {
        path: 'rubrique',
        loadComponent: () => import('./pages/rubrique/rubrique').then((m) => m.Rubrique)
      },
      {
        path: 'sousrubrique',
        loadComponent: () => import('./pages/sousrubrique/sousrubrique').then((m) => m.Sousrubrique)
      },
      {
        path: 'video',
        loadComponent: () => import('./pages/video/video').then((m) => m.Video)
      },
    ],

  }
];
