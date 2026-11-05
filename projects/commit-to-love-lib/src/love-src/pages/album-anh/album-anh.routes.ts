import { Routes } from '@angular/router';
import { AlbumAnhComponent } from './album-anh.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';

export const ALBUM_ANH_ROUTES: Routes = [
  {
    path: '',
    component: AlbumAnhComponent
  },
  {
    path: ':id',
    component: AlbumDetailComponent
  }
]; 