/*
 * Public API Surface of @hbslovely/commit-to-love
 */

export { CORE_VERSION } from './love-src/version';

// ── Journey routes ────────────────────────────────────────────────────────────
export { COMMIT_TO_LOVE_ROUTES } from './love-src/commit-to-love.routes';
export { CHaoMungRoutes } from './love-src/pages/chao-mung/chao-mung.routes';
export { VeChungToiRoutes } from './love-src/pages/ve-chung-toi/ve-chung-toi.routes';
export { ThongTinVoRoutes } from './love-src/pages/thong-tin-vo/thong-tin-vo.routes';
export { ThongTinChongRoutes } from './love-src/pages/thong-tin-chong/thong-tin-chong.routes';
export { ThongTinBoiRoutes } from './love-src/pages/thong-tin-boi/thong-tin-boi.routes';
export { ALBUM_ANH_ROUTES } from './love-src/pages/album-anh/album-anh.routes';
export { MEMORY_PLACES_ROUTES } from './love-src/pages/memory-places/memory-places.routes';

// ── Shell / layout ────────────────────────────────────────────────────────────
export { NavbarComponent } from './love-src/shared/navbar/navbar.component';
export { FooterComponent } from './love-src/shared/components/footer/footer.component';
export { WelcomeDialogComponent } from './love-src/shared/components/welcome-dialog/welcome-dialog.component';
export { CustomPreloadingStrategy } from './love-src/shared/strategies/custom-preloading.strategy';
export { ScrollService } from './love-src/shared/services/scroll.service';
