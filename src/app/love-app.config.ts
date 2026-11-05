import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CustomPreloadingStrategy } from '@hbslovely/commit-to-love';
import { loveStandaloneRoutes } from './love/love.routes';

/** Standalone `/love` entry — keep in sync with app.routes love branch. */
export const loveAppConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      loveStandaloneRoutes,
      withPreloading(CustomPreloadingStrategy),
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'disabled',
      })
    ),
    provideHttpClient(withFetch()),
    provideAnimations(),
  ],
};
