import { bootstrapApplication } from '@angular/platform-browser';

/** Route /feeding uses a separate bootstrap so baby-feeding is not blocked by the desktop shell. */
function isFeedingEntryPath(): boolean {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/feeding' || path.startsWith('/feeding/');
}

if (isFeedingEntryPath()) {
  void import('./app/feeding-main').then((m) => m.bootstrapFeeding());
} else {
  void import('./app/desktop-main').then((m) => m.bootstrapDesktop());
}
