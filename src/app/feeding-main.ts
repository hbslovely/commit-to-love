import { bootstrapApplication } from '@angular/platform-browser';
import { FeedingRootComponent } from './feeding-root.component';
import { feedingAppConfig } from './feeding-app.config';

/** Minimal bootstrap for /feeding — avoids loading the desktop shell bundle. */
export function bootstrapFeeding(): void {
  bootstrapApplication(FeedingRootComponent, feedingAppConfig).catch((err) =>
    console.error(err)
  );
}
