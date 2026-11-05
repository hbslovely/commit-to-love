import { Routes } from '@angular/router';

export const ThongTinBoiRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./thong-tin-boi.component').then((m) => m.ThongTinBoiComponent),
  },
];
