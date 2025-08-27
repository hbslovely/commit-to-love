import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlaceCardComponent } from '../../shared/components/place-card/place-card.component';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { CustomSection, MemoryPlace } from '../../shared/models';

interface PlaceListConfig {
  files: string[];
  basePath: string;
}

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, PlaceCardComponent]
})
export class PlaceDetailComponent implements OnInit, OnDestroy {
  place: MemoryPlace | null = null;
  otherPlaces: MemoryPlace[] = [];
  loading = true;
  isFullscreen = false;
  showDescription = false;
  zoomLevel = 1;
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  lastTranslateX = 0;
  lastTranslateY = 0;

  // New properties for section navigation and toggle
  activeSection: string = 'intro';
  expandedSections = {
    intro: true,
    attractions: true,
    custom: true,
    time: true,
    directions: true,
    food: true,
    nearby: true,
    otherPlaces: true
  };

  locationTypes = [
    { label: 'Trong nước', value: 'domestic', icon: 'pi pi-flag' },
    { label: 'Quốc tế', value: 'international', icon: 'pi pi-globe' }
  ];

  regions = [
    { label: 'Miền Bắc', value: 'north' },
    { label: 'Miền Trung', value: 'central' },
    { label: 'Miền Nam', value: 'south' }
  ];

  features = [
    { label: 'Biển', value: 'sea', icon: 'pi pi-cloud' },
    { label: 'Núi', value: 'mountain', icon: 'pi pi-chart-line' },
    { label: 'Di tích', value: 'historical', icon: 'pi pi-building' },
    { label: 'Chợ', value: 'market', icon: 'pi pi-shopping-cart' },
    { label: 'Ẩm thực', value: 'food', icon: 'pi pi-star' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const placeId = params['id'];
      this.loadPlaceDetails(placeId);
    });
  }

  ngOnDestroy() {
    // Clean up any resources if necessary
  }

  goBack() {
    this.location.back();
  }

  @HostListener('window:keydown.escape')
  handleEscKey() {
    if (this.isFullscreen) {
      this.toggleFullscreen();
    }
  }

  @HostListener('window:wheel', ['$event'])
  handleScroll(event: WheelEvent) {
    // Check if the event target is within the description panel
    const descriptionPanel = document.querySelector('.description-panel');
    if (descriptionPanel && event.target instanceof Node && descriptionPanel.contains(event.target)) {
      // If scrolling in description panel, don't zoom
      return;
    }

    if (this.isFullscreen) {
      event.preventDefault();
      const delta = event.deltaY * -0.001; // Make zoom more subtle
      this.zoom(delta);
    }
  }

  zoom(delta: number) {
    const prevZoom = this.zoomLevel;
    const newZoom = this.zoomLevel + delta;
    // Limit zoom between 0.5 and 4
    this.zoomLevel = Math.min(Math.max(newZoom, 0.5), 4);

    // If zoom level changed, update the transform
    if (prevZoom !== this.zoomLevel) {
      this.updateImageTransform();
    }
  }

  startDrag(event: MouseEvent) {
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.startX = event.clientX - this.lastTranslateX;
      this.startY = event.clientY - this.lastTranslateY;
      event.preventDefault();
    }
  }

  onDrag(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;
      this.updateImageTransform();
    }
  }

  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      this.lastTranslateX = this.translateX;
      this.lastTranslateY = this.translateY;
    }
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.lastTranslateX = 0;
    this.lastTranslateY = 0;
    this.updateImageTransform();
  }

  updateImageTransform() {
    const image = document.querySelector('.fullscreen-modal img') as HTMLElement;
    if (image) {
      image.style.transform = `scale(${this.zoomLevel}) translate(${this.translateX / this.zoomLevel}px, ${this.translateY / this.zoomLevel}px)`;
    }
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      this.resetZoom();
      this.showDescription = false;
    }
  }

  getDirectionText(attraction: any): string {
    const distance = attraction.distance?.toLowerCase() || '';

    if (distance.includes('bắc')) {
      return 'hướng Bắc';
    } else if (distance.includes('nam')) {
      return 'hướng Nam';
    } else if (distance.includes('đông')) {
      return 'hướng Đông';
    } else if (distance.includes('tây')) {
      return 'hướng Tây';
    } else if (distance.includes('đông bắc')) {
      return 'hướng Đông Bắc';
    } else if (distance.includes('đông nam')) {
      return 'hướng Đông Nam';
    } else if (distance.includes('tây bắc')) {
      return 'hướng Tây Bắc';
    } else if (distance.includes('tây nam')) {
      return 'hướng Tây Nam';
    }

    return 'đường chính';
  }

  getPlaceFeatures() {
    if (!this.place) return [];

    return this.features.filter(feature => {
      switch (feature.value) {
        case 'sea':
          return this.place?.description.toLowerCase().includes('biển') ||
                 this.place?.name.toLowerCase().includes('biển') ||
                 this.place?.detailedDescription?.toLowerCase().includes('biển');
        case 'mountain':
          return this.place?.description.toLowerCase().includes('núi') ||
                 this.place?.name.toLowerCase().includes('núi') ||
                 this.place?.detailedDescription?.toLowerCase().includes('núi') ||
                 this.place?.name.toLowerCase().includes('đèo');
        case 'historical':
          return this.place?.description.toLowerCase().includes('di tích') ||
                 this.place?.description.toLowerCase().includes('lịch sử') ||
                 this.place?.name.toLowerCase().includes('đền') ||
                 this.place?.name.toLowerCase().includes('chùa') ||
                 this.place?.name.toLowerCase().includes('lăng');
        case 'market':
          return this.place?.name.toLowerCase().includes('chợ');
        case 'food':
          return !!this.place?.recommendedFood?.length ||
                 !!this.place?.localFood?.length;
        default:
          return false;
      }
    });
  }

  getPlaceRegion(): string | null {
    if (!this.place) return null;

    // This is a simplified version - you might want to use the same region-mappings.json logic
    // that the memory-places component uses for more accurate results
    const location = this.place.location.toLowerCase();
    if (location.includes('hà nội') || location.includes('hải phòng') || location.includes('quảng ninh')) {
      return 'north';
    } else if (location.includes('đà nẵng') || location.includes('huế') || location.includes('quảng nam')) {
      return 'central';
    } else if (location.includes('sài gòn') || location.includes('hồ chí minh') || location.includes('vũng tàu')) {
      return 'south';
    }
    return null;
  }

  getRegionLabel(region: string): string {
    switch (region) {
      case 'north':
        return 'Miền Bắc';
      case 'central':
        return 'Miền Trung';
      case 'south':
        return 'Miền Nam';
      default:
        return '';
    }
  }

  navigateToRegion(region: string) {
    this.router.navigate(['/place'], {
      queryParams: {
        region: region
      }
    });
  }

  navigateToFeature(feature: any) {
    this.router.navigate(['/place'], {
      queryParams: {
        feature: feature.value
      }
    });
  }

  navigateToPlace(placeId: string): void {
    this.router.navigate(['/places', placeId]);
  }

  // Section navigation methods
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.activeSection = sectionId;
      this.expandedSections[sectionId as keyof typeof this.expandedSections] = true;
    }
  }

  toggleSection(sectionId: string): void {
    this.expandedSections[sectionId as keyof typeof this.expandedSections] =
      !this.expandedSections[sectionId as keyof typeof this.expandedSections];
  }

  // Helper methods for section visibility
  hasAttractions(): boolean {
    return !!(
      this.place?.attractions?.religious?.length ||
      this.place?.attractions?.natural?.length ||
      this.place?.attractions?.cultural?.length ||
      this.place?.attractions?.historical?.length
    );
  }

  hasFood(): boolean {
    return !!(
      (this.place?.localFood && this.place.localFood.length > 0) ||
      (this.place?.recommendedFood && this.place.recommendedFood.length > 0)
    );
  }

  hasNearbyAttractions(): boolean {
    return !!(this.place?.nearbyAttractions && this.place.nearbyAttractions.length > 0);
  }

  // Scroll spy for active section
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const sections = [
      'intro',
      'attractions',
      'custom',
      'time',
      'directions',
      'food',
      'nearby'
    ];

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  // Helper methods for type safety
  getCustomSections(): CustomSection[] {
    if (!this.place?.customSection) return [];
    return this.isCustomSectionArray(this.place.customSection) ? this.place.customSection : [];
  }

  getSingleCustomSection(): CustomSection | null {
    if (!this.place?.customSection) return null;
    return this.isCustomSectionArray(this.place.customSection) ? null : this.place.customSection;
  }

  getFirstCustomSectionTitle(): string {
    if (this.place?.customSection) {
      if (Array.isArray(this.place.customSection)) {
        return this.place.customSection[0]?.title || 'Thông tin thêm';
      } else {
        return this.place.customSection.title || 'Thông tin thêm';
      }
    }
    return 'Thông tin thêm';
  }

  // Type guard for custom section
  isCustomSectionArray(section: CustomSection | CustomSection[] | undefined): section is CustomSection[] {
    return Array.isArray(section);
  }

  private loadPlaceDetails(placeId: string) {
    this.http.get<PlaceListConfig>('assets/data/memory-place-list/config.json')
      .pipe(
        switchMap(config => {
          const requests = config.files.map(filename =>
            this.http.get<{places: MemoryPlace[]}>(`${config.basePath}/${filename}`).pipe(
              map(response => response.places)
            )
          );
          return forkJoin(requests);
        }),
        map(results => {
          // Combine all places from different files
          const allPlaces = results.flat();
          const selectedPlace = allPlaces.find(p => p.id === placeId);
          const otherPlaces = selectedPlace
            ? allPlaces
                .filter(p => p.id !== placeId)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
            : [];
          return { selectedPlace, otherPlaces };
        })
      ).subscribe({
        next: ({ selectedPlace, otherPlaces }) => {
          this.place = selectedPlace || null;
          if (!this.place) {
            this.router.navigate(['/']);
            return;
          }
          this.otherPlaces = otherPlaces;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading place details:', error);
          this.loading = false;
          this.router.navigate(['/']);
        }
      });
  }
}
