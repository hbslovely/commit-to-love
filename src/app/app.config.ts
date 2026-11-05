import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withPreloading, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CustomPreloadingStrategy } from '@hbslovely/commit-to-love';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withPreloading(CustomPreloadingStrategy),
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'disabled',
      }),
    ),
    provideHttpClient(withFetch()),
    provideAnimations(),
  ],
};
