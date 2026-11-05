import { bootstrapApplication } from '@angular/platform-browser';
import { LoveRootComponent } from './love-root.component';
import { loveAppConfig } from './love-app.config';

/** Minimal bootstrap for `/love` — avoids loading the desktop shell bundle. */
export function bootstrapLove(): void {
  bootstrapApplication(LoveRootComponent, loveAppConfig).catch((err) =>
    console.error(err)
  );
}
