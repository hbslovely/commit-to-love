import { Routes } from '@angular/router';

export const ThongTinChongRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./thong-tin-chong.component').then(m => m.ThongTinChongComponent)
  }
]; 