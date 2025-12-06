import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'video/:video',
    renderMode: RenderMode.Server,
  },
  {
    path: 'contact/:contact',
    renderMode: RenderMode.Server,
  },
  {
    path: ':rubrique/:sousrubrique/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: ':rubrique/:sousrubrique',
    renderMode: RenderMode.Server,
  }
];
