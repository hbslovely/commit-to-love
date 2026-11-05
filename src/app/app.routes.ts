import { Routes } from '@angular/router';
import { loveRouteBranch } from './love/love.routes';

/**
 * Standalone journey routes (`/feeding`, `/love`). Other pages live in git history.
 */
export const routes: Routes = [
  {
    path: 'feeding',
    loadComponent: () => import('@hbslovely/baby-feeding').then((m) => m.FeedingComponent),
    title: 'Life with baby',
  },
  loveRouteBranch,
];
