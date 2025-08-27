import { Routes } from '@angular/router';

export const VeChungToiRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ve-chung-toi.component').then(m => m.VeChungToiComponent)  
  }
]; 