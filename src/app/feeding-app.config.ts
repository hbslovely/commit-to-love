import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { APP_INFO_TOKEN, provideFeedingConfig } from '@hbslovely/baby-feeding';
import { APP_INFO } from './app-info';
import { environment } from '../environments/environment';

/** Standalone feeding entry — keep in sync with app.routes feeding route. */
export const feedingRoutes: Routes = [
  {
    path: 'feeding',
    loadComponent: () => import('@hbslovely/baby-feeding').then((m) => m.FeedingComponent),
    title: 'Life with baby',
  },
  { path: '', redirectTo: 'feeding', pathMatch: 'full' },
  { path: '**', redirectTo: 'feeding' },
];

export const feedingAppConfig: ApplicationConfig = {
  providers: [
    provideRouter(feedingRoutes),
    provideHttpClient(),
    { provide: APP_INFO_TOKEN, useValue: APP_INFO },
    provideFeedingConfig({ ...environment }),
  ],
};
