import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

interface GalleryImage {
  src: string;
  name: string;
  description: string;
}

interface GalleryControl {
  id: string;
  title: string;
  icon: string;
}

interface GalleryData {
  config: {
    icons: {
      [key: string]: string;
    };
  };
  galleries: {
    id: string;
    title: string;
    images: GalleryImage[];
  }[];
}

@Component({
  selector: 'app-memory-gallery',
  templateUrl: './memory-gallery.component.html',
  styleUrls: [ './memory-gallery.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule
  ]
})
export class MemoryGalleryComponent implements OnInit, OnDestroy {
  currentFilter: string = 'all';
  viewMode: 'masonry' | 'cards' = 'masonry';
  displayedMemories: GalleryImage[] = [];
  galleryData!: GalleryData;
  loading: boolean = false;
  hasMoreImages: boolean = false;
  currentSlideIndex: number = 0;
  galleryControls: GalleryControl[] = [];

  // Lightbox properties
  lightboxActive: boolean = false;
  selectedImage: GalleryImage | null = null;
  currentLightboxIndex: number = 0;

  // Pagination
  private readonly itemsPerPage = 12;
  private currentPage = 1;

  // Carousel specific properties
  autoPlayInterval: any;

  featuredPlaces = [
    {
      id: 'dinh-fansipan',
      name: 'Đỉnh Fansipan',
      location: 'Lào Cai',
      image: 'assets/images/places/checkin-dinh-fansipan-lao-cai.jpg',
      description: 'Chinh phục đỉnh núi cao nhất Đông Dương với độ cao 3.143m'
    },
    {
      id: 'chua-huong',
      name: 'Chùa Hương',
      location: 'Hà Nội',
      image: 'assets/images/places/checkin-chua-huong-ha-noi.jpg',
      description: 'Danh thắng tâm linh nổi tiếng với cảnh quan thiên nhiên tuyệt đẹp'
    },
    {
      id: 'bien-sam-son',
      name: 'Biển Sầm Sơn',
      location: 'Thanh Hóa',
      image: 'assets/images/places/checkin_bai-bien-sam-son_thanh-hoa.jpg',
      description: 'Bãi biển xinh đẹp với những khoảnh khắc bình minh tuyệt vời'
    },
    {
      id: 'da-lat',
      name: 'Thành Phố Đà Lạt',
      location: 'Lâm Đồng',
      image: 'assets/images/places/checkin-cho-da-lat-lam-dong.jpg',
      description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm'
    }
  ];

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.loadGalleryData();
    this.setupKeyboardListeners();
  }

  ngOnDestroy() {
    // this.stopAutoPlay(); // Removed as per edit hint
    this.removeKeyboardListeners();
  }

  private setupKeyboardListeners() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private removeKeyboardListeners() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleKeydown(event: KeyboardEvent) {
    if (!this.lightboxActive) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
    }
  }

  private loadGalleryData() {
    this.http.get<GalleryData>('assets/data/gallery-data.json').subscribe(data => {
      this.galleryData = data;
      this.setupGalleryControls();
      this.filterImages('all');
    });
  }

  private setupGalleryControls() {
    // Add the "All" control first
    this.galleryControls = [ {
      id: 'all',
      title: 'Tất cả',
      icon: this.galleryData.config.icons['all']
    } ];

    // Add controls for each gallery
    this.galleryData.galleries.forEach(gallery => {
      this.galleryControls.push({
        id: gallery.id,
        title: gallery.title,
        icon: this.galleryData.config.icons[gallery.id] || 'pi-image' // Fallback icon if not found in config
      });
    });
  }

  filterImages(filterId: string) {
    this.currentFilter = filterId;
    this.currentPage = 1;

    let allImages: GalleryImage[] = [];

    if (filterId === 'all') {
      allImages = this.galleryData.galleries.reduce((all, gallery) => {
        return [ ...all, ...gallery.images ];
      }, [] as GalleryImage[]);
    } else {
      const gallery = this.galleryData.galleries.find(g => g.id === filterId);
      allImages = gallery ? gallery.images : [];
    }

    // Apply pagination - show first batch
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedMemories = allImages.slice(0, endIndex);

    // Check if there are more images to load
    this.hasMoreImages = allImages.length > endIndex;
    this.currentSlideIndex = 0; // Reset carousel index
  }

  loadMore() {
    if (this.loading || !this.hasMoreImages) return;

    this.loading = true;

    // Get all images for current filter
    let allImages: GalleryImage[] = [];
    if (this.currentFilter === 'all') {
      allImages = this.galleryData.galleries.reduce((all, gallery) => {
        return [ ...all, ...gallery.images ];
      }, [] as GalleryImage[]);
    } else {
      const gallery = this.galleryData.galleries.find(g => g.id === this.currentFilter);
      allImages = gallery ? gallery.images : [];
    }

    // Simulate loading delay
    setTimeout(() => {
      this.currentPage++;
      const endIndex = this.currentPage * this.itemsPerPage;
      this.displayedMemories = allImages.slice(0, endIndex);
      this.hasMoreImages = allImages.length > endIndex;
      this.loading = false;
    }, 500);
  }

  // Carousel Controls
  nextSlide(): void {
    if (this.currentSlideIndex < this.displayedMemories.length - 1) {
      this.currentSlideIndex++;
    }
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  changeView(mode: 'masonry' | 'cards'): void {
    this.viewMode = mode;
  }

  openLightbox(memory: GalleryImage) {
    this.selectedImage = memory;
    this.currentLightboxIndex = this.displayedMemories.findIndex(img => img.src === memory.src);
    this.lightboxActive = true;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxActive = false;
    this.selectedImage = null;
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  nextImage() {
    if (this.currentLightboxIndex < this.displayedMemories.length - 1) {
      this.currentLightboxIndex++;
      this.selectedImage = this.displayedMemories[this.currentLightboxIndex];
    }
  }

  previousImage() {
    if (this.currentLightboxIndex > 0) {
      this.currentLightboxIndex--;
      this.selectedImage = this.displayedMemories[this.currentLightboxIndex];
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.classList.add('loaded');
    }
  }

  getFilterCount(filterId: string): number {
    if (!this.galleryData) return 0;

    if (filterId === 'all') {
      return this.galleryData.galleries.reduce((total, gallery) => total + gallery.images.length, 0);
    }

    const gallery = this.galleryData.galleries.find(g => g.id === filterId);
    return gallery ? gallery.images.length : 0;
  }

  getActiveFilterName(): string {
    const filter = this.galleryControls.find(control => control.id === this.currentFilter);
    return filter ? filter.title : '';
  }

  clearFilter(): void {
    this.currentFilter = 'all';
    this.filterImages('all');
  }

  getTotalMemories(): number {
    return this.displayedMemories.length;
  }

  getYearsCount(): number {
    // Calculate years since a specific date, or return a default
    const startYear = 2020; // Adjust this to your actual start year
    const currentYear = new Date().getFullYear();
    return currentYear - startYear + 1;
  }

  navigateToAlbum(): void {
    this.router.navigate([ '/album-anh' ]);
  }
}
