import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  },
  {
    path: 'appkey-validation',
    renderMode: RenderMode.Client
  },
  //  {
  //   path: 'login',
  //   renderMode: RenderMode.Server
  // }

];
