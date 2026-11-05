import { Route, Routes } from '@angular/router';
import { COMMIT_TO_LOVE_ROUTES } from '@hbslovely/commit-to-love';
import { LoveShellComponent } from './love-shell.component';

/** Mounted at `/love` — child paths match the commit-to-love journey. */
export const loveRouteBranch: Route = {
  path: 'love',
  component: LoveShellComponent,
  children: COMMIT_TO_LOVE_ROUTES,
  title: 'Commit to Love',
};

export const loveStandaloneRoutes: Routes = [
  loveRouteBranch,
  { path: '', redirectTo: 'love', pathMatch: 'full' },
  { path: '**', redirectTo: 'love' },
];
