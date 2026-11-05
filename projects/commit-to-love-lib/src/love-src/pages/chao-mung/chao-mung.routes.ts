import { Routes } from '@angular/router';

export const CHaoMungRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chao-mung.component').then(m => m.ChaoMungComponent)
  }
]; 