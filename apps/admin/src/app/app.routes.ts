import { ArticleFormComponent } from './pages/article/article-form/article-form';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./shared/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'user',
        loadComponent: () => import('./pages/user/user').then((m) => m.User)
      },
      {
        path: 'article',
        loadComponent: () => import('./pages/article/article').then((m) => m.ArticleListComponent)
      },
      {
        path: 'article/form',
        loadComponent: () => import('./pages/article/article-form/article-form').then((m) => m.ArticleFormComponent)
      },
      {
        path: 'dimension',
        loadComponent: () => import('./pages/dimension/dimension').then((m) => m.Dimension)
      },
      {
        path: 'event',
        loadComponent: () => import('./pages/event/event').then((m) => m.Event)
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
    ]
  }
];
