import { articleResolver } from './shared/resolvers/article-resolver';
import { articleListResolver } from './../../../../libs/articles/article-list-resolver';
import { Route } from '@angular/router';
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
import { sousRubriqueListResolver } from './shared/resolvers/sous-rubrique-list-resolver';
import { sousRubriqueResolver } from './shared/resolvers/sous-rubrique-resolver';
import { videoListResolver } from './shared/resolvers/video-list-resolver';
import { videoResolver } from './shared/resolvers/video-resolver';
import { userResolver } from './shared/resolvers/user-resolver';
import { userListResolver } from './shared/resolvers/user-list-resolver';
import { changePasswordResolver } from '@wkpcamer/users';
import { authGuard } from '@wkpcamer/auth';


export const appRoutes: Route[] = [
  {
    path:'',
    loadChildren:()=> import('@wkpcamer/users').then((m) => m.MY_LIB_ROUTES),
  },
  {

    path: 'admin',
    canActivate:[authGuard],
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
        path:'unauthorize',
        loadComponent:()=>import('./pages/unauthorize/unauthorize.component').then((m)=>m.UnauthorizeComponent)
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
        children:[
          {
            path: '',
            loadComponent: () => import('./pages/event/event-list.component').then((m) => m.EventListComponent),
            resolve:{events:eventListResolver},
          },
          {
            path: 'form',
            loadComponent: () => import('./pages/event/event-form.component').then((m) => m.EventFormComponent)
          },
          {
            path: 'show/:id',
            loadComponent: () => import('./pages/event/event-form.component').then((m) => m.EventFormComponent),
            resolve:{event:eventResolver}
          },
        ]
      },
      {
        path: 'pub',
        children:[
          {
            path: '',
            loadComponent: () => import('./pages/pub/pub-list.component').then((m) => m.PubListComponent),
            resolve:{pubs:pubListResolver},
            canActivate:[adminGuard],
          },
          {
            path: 'form',
            loadComponent: () => import('./pages/pub/pub-form.component').then((m) => m.PubFormComponent),
            canActivate:[adminGuard],
          },
          {
            path: 'show/:id',
            loadComponent: () => import('./pages/pub/pub-form.component').then((m) => m.PubFormComponent),
            resolve:{pub:pubResolver},
            canActivate:[adminGuard],

          },
        ]
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
        children:[
            {
              path: '',
              loadComponent: () => import('./pages/sousrubrique/sous-rubrique-list/sous-rubrique-list.component').then((m) => m.SousRubriqueListComponent),
              resolve:{sousrubriques:sousRubriqueListResolver},
            },
            {
              path: 'form',
              loadComponent: () => import('./pages/sousrubrique/sous-rubrique-form/sous-rubrique-form.component').then((m) => m.SousRubriqueFormComponent),

            },
            {
              path: 'show/:id',
              loadComponent: () => import('./pages/sousrubrique/sous-rubrique-form/sous-rubrique-form.component').then((m) => m.SousRubriqueFormComponent),
              resolve:{sousrubrique:sousRubriqueResolver},
            },
        ]
      },
      {
        path: 'video',
        children:[
          {
            path: '',
            loadComponent: () => import('./pages/video/video-list/video-list.component').then((m) => m.VideoListComponent),
            resolve:{videos:videoListResolver},
          },
          {
            path: 'form',
            loadComponent: () => import('./pages/video/video-form/video-form.component').then((m) => m.VideoFormComponent),

          },
          {
            path: 'show/:id',
            loadComponent: () => import('./pages/video/video-form/video-form.component').then((m) => m.VideoFormComponent),
            resolve:{video:videoResolver},
          },
        ]

      },
      {
         path: 'user',
         canActivate:[adminGuard],
         children:[
            {
              path: '',
              loadComponent: () => import('./pages/user/user-list/user-list.component').then((m) => m.UserListComponent),
              resolve:{users:userListResolver},
            },
            {
              path: 'form',
              loadComponent: () => import('./pages/user/user-form/user-form.component').then((m) => m.UserFormComponent),
              //resolve:{videos:videoListResolver},
            },
            {
              path: 'show/:id',
              loadComponent: () => import('./pages/user/user-form/user-form.component').then((m) => m.UserFormComponent),
              resolve:{user:userResolver},
            },
            {
              path: 'activating/:email',
              loadComponent: () => import('./pages/user/user-form/user-form.component').then((m) => m.UserFormComponent),
              resolve:{userpw:changePasswordResolver},
            },
         ]

      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ],

  }
];
