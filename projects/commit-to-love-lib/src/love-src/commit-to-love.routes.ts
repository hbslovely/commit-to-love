import { Routes } from '@angular/router';

/**
 * Full journey routes for Commit to Love.
 * Host apps can spread these under any path prefix.
 */
export const COMMIT_TO_LOVE_ROUTES: Routes = [
  {
    path: 'chao-mung',
    loadChildren: () =>
      import('./pages/chao-mung/chao-mung.routes').then((m) => m.CHaoMungRoutes),
    data: { preload: true },
  },
  {
    path: 've-chung-toi',
    loadChildren: () =>
      import('./pages/ve-chung-toi/ve-chung-toi.routes').then((m) => m.VeChungToiRoutes),
    data: { preload: true },
  },
  {
    path: 'thong-tin-vo',
    loadChildren: () =>
      import('./pages/thong-tin-vo/thong-tin-vo.routes').then((m) => m.ThongTinVoRoutes),
  },
  {
    path: 'thong-tin-chong',
    loadChildren: () =>
      import('./pages/thong-tin-chong/thong-tin-chong.routes').then((m) => m.ThongTinChongRoutes),
  },
  {
    path: 'thong-tin-boi',
    loadChildren: () =>
      import('./pages/thong-tin-boi/thong-tin-boi.routes').then((m) => m.ThongTinBoiRoutes),
  },
  {
    path: 'album-anh',
    loadChildren: () =>
      import('./pages/album-anh/album-anh.routes').then((m) => m.ALBUM_ANH_ROUTES),
    data: { preload: true },
  },
  {
    path: 'album-anh/:id',
    loadChildren: () =>
      import('./pages/album-anh/album-anh.routes').then((m) => m.ALBUM_ANH_ROUTES),
  },
  {
    path: 'place',
    loadChildren: () =>
      import('./pages/memory-places/memory-places.routes').then((m) => m.MEMORY_PLACES_ROUTES),
  },
  {
    path: '',
    redirectTo: 'chao-mung',
    pathMatch: 'full',
  },
];
