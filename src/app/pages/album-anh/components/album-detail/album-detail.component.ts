import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumDetailHeaderComponent } from '../album-detail-header/album-detail-header.component';
import { AlbumGalleryComponent } from '../../../../shared/components/album-gallery/album-gallery.component';
import { Album, Photo, AlbumGalleryImage } from '../../../../shared/models';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [
    CommonModule,
    AlbumDetailHeaderComponent,
    AlbumGalleryComponent
  ],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  albumPhotos: AlbumGalleryImage[] = [];
  selectedPhoto: Photo | null = null;
  viewMode: 'masonry' | 'carousel' = 'masonry';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (!albumId) {
      this.router.navigate(['/album-anh']);
      return;
    }

    try {
      const response = await fetch('assets/data/album-data.json');
      const data = await response.json();
      this.album = data.albums.find((a: Album) => a.id === albumId);

      if (!this.album || !this.album.photos) {
        this.router.navigate(['/album-anh']);
        return;
      }

      // Properly map photos to match AlbumGalleryImage interface
      this.albumPhotos = this.album.photos.map(photo => ({
        src: photo.url,
        name: photo.title,
        description: photo.description,
        url: photo.url,
        title: photo.title,
        caption: photo.description
      }));
    } catch (error) {
      console.error('Error loading album data:', error);
      this.router.navigate(['/album-anh']);
    }
  }

  getAlbumPreviewPhotos(): string[] {
    if (!this.album?.photos) return [];
    return this.album.photos.slice(0, 3).map(photo => photo.url);
  }

  getMasonryColumns(): Photo[][] {
    if (!this.album?.photos) return [[], [], []];
    const columns: Photo[][] = [[], [], []];
    this.album.photos.forEach((photo, index) => {
      columns[index % 3].push(photo);
    });
    return columns;
  }

  setViewMode(mode: 'masonry' | 'carousel') {
    this.viewMode = mode;
  }

  openPhotoViewer(photo: Photo) {
    this.selectedPhoto = photo;
  }

  onCarouselImageClick(galleryImage: AlbumGalleryImage) {
    // Find the corresponding Photo object from album data
    const photo = this.album?.photos?.find(p => p.url === galleryImage.src);
    if (photo) {
      this.openPhotoViewer(photo);
    }
  }

  closePhotoViewer() {
    this.selectedPhoto = null;
  }

  canNavigatePrev(): boolean {
    if (!this.album?.photos || !this.selectedPhoto) return false;
    const currentIndex = this.album.photos.findIndex(p => p.id === this.selectedPhoto?.id);
    return currentIndex > 0;
  }

  canNavigateNext(): boolean {
    if (!this.album?.photos || !this.selectedPhoto) return false;
    const currentIndex = this.album.photos.findIndex(p => p.id === this.selectedPhoto?.id);
    return currentIndex < this.album.photos.length - 1;
  }

  prevPhoto(event: Event) {
    event.stopPropagation();
    if (!this.album?.photos || !this.selectedPhoto) return;
    const currentIndex = this.album.photos.findIndex(p => p.id === this.selectedPhoto?.id);
    if (currentIndex > 0) {
      this.selectedPhoto = this.album.photos[currentIndex - 1];
    }
  }

  nextPhoto(event: Event) {
    event.stopPropagation();
    if (!this.album?.photos || !this.selectedPhoto) return;
    const currentIndex = this.album.photos.findIndex(p => p.id === this.selectedPhoto?.id);
    if (currentIndex < this.album.photos.length - 1) {
      this.selectedPhoto = this.album.photos[currentIndex + 1];
    }
  }

  goBack() {
    this.router.navigate(['/album-anh']);
  }
}
