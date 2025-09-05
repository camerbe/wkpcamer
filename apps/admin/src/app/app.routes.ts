import { articleResolver } from './shared/resolvers/article-resolver';
import { articleListResolver } from './../../../../libs/articles/article-list-resolver';
import { Route } from '@angular/router';
import { AuthGard } from './guards/auth-gard';
import { adminGuard } from './guards/admin-guard';
import { dimensionListResolver } from './shared/resolvers/dimension-list-resolver';
import { dimensionResolver } from './shared/resolvers/dimension-resolver';
import { eventListResolver } from './shared/resolvers/event-list-resolver';
import { eventResolver } from './shared/resolvers/event-resolver';
import { pubResolver } from './shared/resolvers/pub-resolver';
import { pubListResolver } from './shared/resolvers/pub-list-resolver';
import { statsResolver } from './shared/resolvers/stats-resolver';
import { typePubListResolver } from './shared/resolvers/type-pub-list-resolver';
import { typePubResolver } from './shared/resolvers/type-pub-resolver';
import { rubriqueListResolver } from './shared/resolvers/rubrique-list-resolver';
import { rubriqueResolver } from './shared/resolvers/rubrique-resolver';


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
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/stats/stats.component').then((m) => m.StatsComponent),
        resolve: { statistique: statsResolver }
      },
      {
        path: 'user',
        canActivate:[adminGuard],
        loadComponent: () => import('./pages/user/user').then((m) => m.User)
      },
      {
         path: 'article',
         children:[
            {
              path: '',
              loadComponent: () => import('./pages/article/article').then((m) => m.ArticleListComponent),
              resolve: { ArticleItem: articleListResolver }
            },
            {
              path: 'show/:id',
              loadComponent: () => import('./pages/article/article-form/article-form').then((m) => m.ArticleFormComponent),
              resolve: { article: articleResolver }
            },
            {
              path: 'form',
              loadComponent: () => import('./pages/article/article-form/article-form').then((m) => m.ArticleFormComponent),
            },
         ]
      },
      {
        path: 'dimension',
        children:[
          {
            path: '',
            loadComponent: () => import('./pages/dimension/dimension.component').then((m) => m.DimensionListComponent),
            resolve:{dimensions:dimensionListResolver},
            canActivate:[adminGuard]
          },
          {
            path: 'show/:id',
            loadComponent: () => import('./pages/dimension/dimension-form.component').then((m) => m.DimensionFormComponent),
            resolve:{dimension:dimensionResolver},
            canActivate:[adminGuard]
          },
          {
            path: 'form',
            loadComponent: () => import('./pages/dimension/dimension-form.component').then((m) => m.DimensionFormComponent),
            canActivate:[adminGuard]
          },
        ]
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
        path: 'event/show/:id',
        loadComponent: () => import('./pages/event/event-form.component').then((m) => m.EventFormComponent),
        resolve:{event:eventResolver}
      },
      {
        path: 'pub',
        loadComponent: () => import('./pages/pub/pub-list.component').then((m) => m.PubListComponent),
        resolve:{pubs:pubListResolver},
        canActivate:[adminGuard],
      },
      {
        path: 'pub/form',
        loadComponent: () => import('./pages/pub/pub-form.component').then((m) => m.PubFormComponent),
        canActivate:[adminGuard],
      },
      {
        path: 'pub/show/:id',
        loadComponent: () => import('./pages/pub/pub-form.component').then((m) => m.PubFormComponent),
        resolve:{pub:pubResolver},
        canActivate:[adminGuard],

      },
      {
        path: 'typepub',
        canActivate:[adminGuard],
        children:[
          {
            path: '',
            loadComponent: () => import('./pages/typepub/type-pub-list/type-pub-list.component').then((m) => m.TypePubListComponent),
            resolve:{typepubs:typePubListResolver},
          },
          {
            path: 'form',
            loadComponent: () => import('./pages/typepub/type-pub-form/type-pub-form.component').then((m) => m.TypePubFormComponent)
          },
          {
            path: 'show/:id',
            loadComponent: () => import('./pages/typepub/type-pub-form/type-pub-form.component').then((m) => m.TypePubFormComponent),
            resolve:{typepub:typePubResolver},
          },
        ]
      },

      {
        path: 'rubrique',
        children:[
          {
            path: '',
            loadComponent: () => import('./pages/rubrique/rubrique-list/rubrique-list.component').then((m) => m.RubriqueListComponent),
            resolve:{rubriques:rubriqueListResolver},
          },
          {
            path: 'form',
            loadComponent: () => import('./pages/rubrique/rubrique-form/rubrique-form.component').then((m) => m.RubriqueFormComponent),

          },
          {
            path: 'show/:id',
            loadComponent: () => import('./pages/rubrique/rubrique-form/rubrique-form.component').then((m) => m.RubriqueFormComponent),
            resolve:{rubrique:rubriqueResolver},
          },
        ]
      },

      {
        path: 'sousrubrique',
        loadComponent: () => import('./pages/sousrubrique/sousrubrique').then((m) => m.Sousrubrique)
      },
      {
        path: 'video',
        loadComponent: () => import('./pages/video/video').then((m) => m.Video)
      },
      {
        path: '**',
        redirectTo: ''
      }
    ],

  }
];
