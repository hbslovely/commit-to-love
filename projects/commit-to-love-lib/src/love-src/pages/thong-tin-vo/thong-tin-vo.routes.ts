import { Routes } from '@angular/router';

export const ThongTinVoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./thong-tin-vo.component').then(m => m.ThongTinVoComponent)
  }
]; 