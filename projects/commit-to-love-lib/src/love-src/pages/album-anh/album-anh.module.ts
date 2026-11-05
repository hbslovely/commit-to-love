import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumAnhComponent } from './album-anh.component';
import { AlbumHeaderComponent } from './components/album-header/album-header.component';
import { AlbumDetailHeaderComponent } from './components/album-detail-header/album-detail-header.component';
import { AlbumGalleryComponent } from '../../shared/components/album-gallery/album-gallery.component';

@NgModule({
  declarations: [
    AlbumAnhComponent,
    AlbumHeaderComponent,
    AlbumDetailHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AlbumGalleryComponent
  ],
  exports: [
    AlbumAnhComponent
  ]
})
export class AlbumAnhModule { } 