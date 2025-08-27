import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { CustomPreloadingStrategy } from './shared/strategies/custom-preloading.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withPreloading(CustomPreloadingStrategy)
    ),
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
};
