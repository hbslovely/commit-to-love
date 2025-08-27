import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

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
  styleUrls: ['./memory-gallery.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule
  ]
})
export class MemoryGalleryComponent implements OnInit {
  currentFilter: string = 'all';
  viewMode: 'carousel' | 'masonry' | 'cards' = 'carousel';
  displayedMemories: GalleryImage[] = [];
  galleryData!: GalleryData;
  loading: boolean = false;
  hasMoreImages: boolean = false;
  currentSlideIndex: number = 0;
  galleryControls: GalleryControl[] = [];

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadGalleryData();
  }

  ngOnDestroy() {
    // this.stopAutoPlay(); // Removed as per edit hint
  }

  private loadGalleryData() {
    this.http.get<GalleryData>('assets/data/gallery-data.json').subscribe(data => {
      this.galleryData = data;
      this.galleryControls = [
        { id: 'all', title: 'Tất Cả', icon: data.config.icons['all'] },
        ...data.galleries.map(gallery => ({
          id: gallery.id,
          title: gallery.title,
          icon: data.config.icons[gallery.id]
        }))
      ];
      this.filterImages('all');
    });
  }

  private setupGalleryControls() {
    // Add the "All" control first
    this.galleryControls = [{
      id: 'all',
      title: 'Tất cả',
      icon: this.galleryData.config.icons['all']
    }];

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
    this.currentPage = 1; // Reset pagination when filter changes
    
    if (filterId === 'all') {
      this.displayedMemories = this.galleryData.galleries.reduce((all, gallery) => {
        return [...all, ...gallery.images.map(img => ({
          ...img,
          galleryId: gallery.id
        }))];
      }, [] as (GalleryImage & { galleryId: string })[]);
    } else {
      const gallery = this.galleryData.galleries.find(g => g.id === filterId);
      this.displayedMemories = gallery ? gallery.images.map(img => ({
        ...img,
        galleryId: gallery.id
      })) : [];
    }

    // Apply pagination
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedMemories = this.displayedMemories.slice(startIndex, endIndex);

    // Check if there are more images to load
    this.hasMoreImages = this.displayedMemories.length < this.displayedMemories.length; // This logic needs to be re-evaluated based on the new structure
  }

  loadMore() {
    if (this.loading || !this.hasMoreImages) return;

    this.loading = true;
    // Simulate loading delay
    setTimeout(() => {
      this.currentPage++;
      this.filterImages(this.currentFilter); // Re-apply filter to get the next set
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

  changeView(mode: 'carousel' | 'masonry' | 'cards'): void {
    this.viewMode = mode;
  }

  openLightbox(memory: GalleryImage) {
    // Implement lightbox functionality here
    console.log('Opening lightbox for:', memory);
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
}
