import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Album, Photo, AlbumGalleryImage } from '../../../../shared/models';
import JSZip from 'jszip';


@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  album: Album | null = null;
  albumPhotos: AlbumGalleryImage[] = [];
  selectedPhoto: Photo | null = null;
  selectedPhotoIndex: number = 0;
  viewMode: 'masonry' | 'carousel' = 'masonry';
  
  // Search and filter
  searchQuery: string = '';
  filteredPhotos: Photo[] = [];
  
  // Carousel
  currentPhotoIndex: number = 0;
  
  // Slideshow
  isSlideshow: boolean = false;
  slideshowIndex: number = 0;
  slideshowPaused: boolean = false;
  slideshowInterval: any;
  
  // Liked photos
  likedPhotos: Set<string> = new Set();
  
  // Computed properties for better performance
  get currentPhoto(): Photo | undefined {
    return this.filteredPhotos[this.currentPhotoIndex];
  }
  
  get currentSlideshowPhoto(): Photo | undefined {
    return this.filteredPhotos[this.slideshowIndex];
  }
  
  get filteredPhotosLength(): number {
    return this.filteredPhotos.length;
  }

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
      
      this.filteredPhotos = [...this.album.photos];
    } catch (error) {
      console.error('Error loading album data:', error);
      this.router.navigate(['/album-anh']);
    }
  }

  ngOnDestroy() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
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


  onCarouselImageClick(galleryImage: AlbumGalleryImage) {
    // Find the corresponding Photo object from album data
    const photo = this.album?.photos?.find(p => p.url === galleryImage.src);
    if (photo) {
      const index = this.filteredPhotos.indexOf(photo);
      this.openPhotoViewer(photo, index);
    }
  }

  closePhotoViewer() {
    this.selectedPhoto = null;
    // Restore body scroll when photo viewer is closed
    document.body.style.overflow = '';
  }

  canNavigatePrev(): boolean {
    return this.selectedPhotoIndex > 0;
  }

  canNavigateNext(): boolean {
    return this.selectedPhotoIndex < this.filteredPhotos.length - 1;
  }

  prevPhoto(event: Event) {
    event.stopPropagation();
    if (this.canNavigatePrev()) {
      this.selectedPhotoIndex--;
      this.selectedPhoto = this.filteredPhotos[this.selectedPhotoIndex];
    }
  }

  nextPhoto(event: Event) {
    event.stopPropagation();
    if (this.canNavigateNext()) {
      this.selectedPhotoIndex++;
      this.selectedPhoto = this.filteredPhotos[this.selectedPhotoIndex];
    }
  }

  goBack() {
    this.router.navigate(['/album-anh']);
  }

  // New enhanced methods
  setViewMode(mode: 'masonry' | 'carousel'): void {
    this.viewMode = mode;
  }

  // Search functionality
  onSearchChange(): void {
    if (!this.album?.photos) return;
    
    if (!this.searchQuery.trim()) {
      this.filteredPhotos = [...this.album.photos];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredPhotos = this.album.photos.filter(photo =>
        photo.title.toLowerCase().includes(query) ||
        (photo.description && photo.description.toLowerCase().includes(query))
      );
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  getFilteredPhotos(): Photo[] {
    return this.filteredPhotos;
  }

  trackByPhoto(index: number, photo: Photo): string {
    return photo.url;
  }

  // Album info methods
  getAlbumYear(): string {
    return this.album?.id.includes('2024') ? '2024' : 
           this.album?.id.includes('2023') ? '2023' : '2022';
  }

  // Photo viewer enhancements
  openPhotoViewer(photo: Photo, index?: number): void {
    this.selectedPhoto = photo;
    this.selectedPhotoIndex = index !== undefined ? index : this.filteredPhotos.indexOf(photo);
    // Disable body scroll when photo viewer is open
    document.body.style.overflow = 'hidden';
  }

  selectPhoto(index: number): void {
    this.selectedPhotoIndex = index;
    this.selectedPhoto = this.filteredPhotos[index];
  }

  // Carousel methods

  prevCarouselPhoto(): void {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    }
  }

  nextCarouselPhoto(): void {
    if (this.currentPhotoIndex < this.filteredPhotos.length - 1) {
      this.currentPhotoIndex++;
    }
  }

  setCurrentPhoto(index: number): void {
    this.currentPhotoIndex = index;
  }


  // Like functionality
  isLiked(photo: Photo): boolean {
    return this.likedPhotos.has(photo.url);
  }

  toggleLike(photo: Photo, event?: Event): void {
    if (event) event.stopPropagation();
    
    if (this.likedPhotos.has(photo.url)) {
      this.likedPhotos.delete(photo.url);
    } else {
      this.likedPhotos.add(photo.url);
    }
  }

  // Share functionality
  sharePhoto(photo: Photo, event?: Event): void {
    if (event) event.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: photo.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(photo.url);
    }
  }

  // Download functionality
  downloadPhoto(photo: Photo): void {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // For cross-origin images, we need to fetch and create blob URL
    fetch(photo.url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        // Fallback: open in new tab
        window.open(photo.url, '_blank');
      });
  }

  async downloadAlbum(): Promise<void> {
    if (!this.album || !this.filteredPhotos.length) return;

    const zip = new JSZip();
    const albumName = this.album.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    try {
      // Show loading state (you can add a loading indicator)
      console.log('Preparing album download...');
      
      const downloadPromises = this.filteredPhotos.map(async (photo, index) => {
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          const fileName = `${index + 1}_${photo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
          zip.file(fileName, blob);
        } catch (error) {
          console.warn(`Failed to download image: ${photo.title}`, error);
        }
      });

      await Promise.all(downloadPromises);

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(zipBlob);
      link.href = url;
      link.download = `${albumName}_album.zip`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      console.log('Album download completed!');
    } catch (error) {
      console.error('Error downloading album:', error);
      alert('Có lỗi xảy ra khi tải album. Vui lòng thử lại.');
    }
  }


  // Slideshow functionality
  startSlideshow(): void {
    this.isSlideshow = true;
    this.slideshowIndex = 0;
    this.slideshowPaused = false;
    this.startSlideshowInterval();
  }

  stopSlideshow(): void {
    this.isSlideshow = false;
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
    }
  }

  pauseSlideshow(): void {
    this.slideshowPaused = !this.slideshowPaused;
    if (this.slideshowPaused) {
      clearInterval(this.slideshowInterval);
    } else {
      this.startSlideshowInterval();
    }
  }

  private startSlideshowInterval(): void {
    this.slideshowInterval = setInterval(() => {
      this.slideshowIndex = (this.slideshowIndex + 1) % this.filteredPhotos.length;
    }, 3000);
  }


  // Fullscreen functionality
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
