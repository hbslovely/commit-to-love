import { Routes } from '@angular/router';

/**
 * TEMP: only `/feeding` is registered — other standalone pages removed for faster focus on baby-feeding.
 * Restore from git history: boi-vui, hello-2026, chi-tieu, pit, tax, my-timesheet, …
 */
export const routes: Routes = [
  {
    path: 'feeding',
    loadComponent: () => import('@hbslovely/baby-feeding').then((m) => m.FeedingComponent),
    title: 'Life with baby',
  },
];
