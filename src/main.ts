import { bootstrapApplication } from '@angular/platform-browser';

function normalizedPath(): string {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

/** Route /feeding uses a separate bootstrap so baby-feeding is not blocked by the desktop shell. */
function isFeedingEntryPath(): boolean {
  const path = normalizedPath();
  return path === '/feeding' || path.startsWith('/feeding/');
}

/** Route /love uses a separate bootstrap so commit-to-love is not blocked by the desktop shell. */
function isLoveEntryPath(): boolean {
  const path = normalizedPath();
  return path === '/love' || path.startsWith('/love/');
}

if (isFeedingEntryPath()) {
  void import('./app/feeding-main').then((m) => m.bootstrapFeeding());
} else if (isLoveEntryPath()) {
  void import('./app/love-main').then((m) => m.bootstrapLove());
} else {
  void import('./app/desktop-main').then((m) => m.bootstrapDesktop());
}
