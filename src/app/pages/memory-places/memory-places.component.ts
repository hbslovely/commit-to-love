import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MemoryPlace } from '../../shared/models';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { removeVietnameseTones } from '../../shared/utils/string.utils';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlaceCardComponent } from '../../shared/components/place-card/place-card.component';
import { MemoryPlacesFilterComponent } from '../../shared/components/memory-places-filter/memory-places-filter.component';

interface Filter {
  region: string[];
  features: string[];
  locationType: string[];
}

interface PlaceListConfig {
  files: string[];
  basePath: string;
}

interface LocationMappings {
  locations: {
    domestic: {
      north: string[];
      central: string[];
      south: string[];
    };
    international: {
      asia: {
        [country: string]: string[];
      };
      europe: {
        [country: string]: string[];
      };
      america: {
        [country: string]: string[];
      };
    };
  };
}

interface FilterTag {
  type: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-memory-places',
  standalone: true,
  imports: [CommonModule, PlaceCardComponent, FormsModule, MemoryPlacesFilterComponent, RouterModule],
  templateUrl: './memory-places.component.html',
  styleUrls: ['./memory-places.component.scss']
})
export class MemoryPlacesComponent implements OnInit {
  places: MemoryPlace[] = [];
  filteredPlaces: MemoryPlace[] = [];
  paginatedPlaces: MemoryPlace[] = [];
  loading = true;
  isResetting = false;
  searchText = '';
  viewMode: 'grid' | 'list' = 'grid';
  isFilterCollapsed = false;
  sortMode: 'none' | 'asc' | 'desc' = 'none';
  private locationMappings: LocationMappings | null = null;
  isMobile = false;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  totalPages = 0;

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

  selectedFilters: Filter = {
    region: [],
    features: [],
    locationType: []
  };

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkMobile();
  }

  ngOnInit() {
    // First load the data
    forkJoin({
      config: this.http.get<PlaceListConfig>('assets/data/memory-place-list/config.json'),
      locations: this.http.get<LocationMappings>('assets/data/region-mappings.json')
    }).pipe(
      switchMap(({ config, locations }) => {
        this.locationMappings = locations;
        const requests = config.files.map(filename =>
          this.http.get<{places: MemoryPlace[]}>(`${config.basePath}/${filename}`).pipe(
            map(response => response.places)
          )
        );
        return forkJoin(requests);
      })
    ).subscribe({
      next: (results) => {
        this.places = results.flat();
        this.applyFilters();
        this.loading = false;

        // After data is loaded, handle query params
        this.route.queryParams.subscribe(params => {
          if (params['region']) {
            this.selectedFilters.region = [params['region']];
          }
          if (params['feature']) {
            this.selectedFilters.features = [params['feature']];
          }
          this.applyFilters();
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(event: { type: string; value: string }) {
    this.toggleFilter(event.type, event.value);
    // Only collapse panel on mobile after filter change
    if (this.isMobile) {
      this.isFilterCollapsed = true;
      document.body.style.overflow = '';
    }
  }

  toggleFilter(type: string, value: string): void {
    const filterArray = (this.selectedFilters as any)[type];
    const index = filterArray.indexOf(value);

    if (index === -1) {
      filterArray.push(value);
    } else {
      filterArray.splice(index, 1);
    }

    this.applyFilters();
  }

  applyFiltersAndClose() {
    this.applyFilters();
    if (this.isMobile) {
      this.isFilterCollapsed = true;
      document.body.style.overflow = '';
    }
  }

  applyFilters() {
    // Apply filter logic without collapsing the panel
    this.currentPage = 1; // Reset to first page
    this.updateFilteredPlaces();
  }

  private updateFilteredPlaces() {
    this.filteredPlaces = this.places.filter(place => {
      // If no filters are selected and no search text, show all places
      if (this.selectedFilters.region.length === 0 &&
          this.selectedFilters.features.length === 0 &&
          this.selectedFilters.locationType.length === 0 &&
          !this.searchText.trim()) {
        return true;
      }

      let matchesRegion = true;
      let matchesFeatures = true;
      let matchesLocationType = true;
      let matchesSearch = true;

      // Check text search
      if (this.searchText.trim()) {
        const searchLower = removeVietnameseTones(this.searchText.toLowerCase().trim());
        const nameNormalized = removeVietnameseTones(place.name);
        const locationNormalized = removeVietnameseTones(place.location);
        const descriptionNormalized = removeVietnameseTones(place.description);
        const detailedDescriptionNormalized = place.detailedDescription ? removeVietnameseTones(place.detailedDescription) : '';

        matchesSearch =
          nameNormalized.includes(searchLower) ||
          locationNormalized.includes(searchLower) ||
          descriptionNormalized.includes(searchLower) ||
          detailedDescriptionNormalized.includes(searchLower);
      }

      // Check location type filters
      if (this.selectedFilters.locationType.length > 0) {
        matchesLocationType = this.matchesLocationType(place.location);
      }

      // Check region filters
      if (this.selectedFilters.region.length > 0) {
        matchesRegion = this.matchesRegion(place.location);
      }

      // Check feature filters
      if (this.selectedFilters.features.length > 0) {
        matchesFeatures = this.matchesFeatures(place);
      }

      return matchesRegion && matchesFeatures && matchesLocationType && matchesSearch;
    });

    // Apply sorting after filtering
    this.filteredPlaces = this.sortPlaces(this.filteredPlaces);
    this.updatePagination();
  }

  private matchesLocationType(location: string): boolean {
    if (!this.locationMappings) return false;

    const isInternational = this.isInternationalLocation(location);
    return this.selectedFilters.locationType.some(type => {
      if (type === 'international') {
        return isInternational;
      } else {
        return !isInternational;
      }
    });
  }

  private isInternationalLocation(location: string): boolean {
    if (!this.locationMappings) return false;

    const { international } = this.locationMappings.locations;
    const continents = ['asia', 'europe', 'america'] as const;

    return continents.some(continent =>
      Object.values(international[continent]).some(countryNames =>
        countryNames.some(name => location.toLowerCase().includes(name.toLowerCase()))
      )
    );
  }

  private matchesRegion(location: string): boolean {
    if (!this.locationMappings) return false;

    return this.selectedFilters.region.some(region => {
      const regionLocations = this.locationMappings!.locations.domestic[region as keyof typeof this.locationMappings.locations.domestic];
      return regionLocations.some(loc => location.includes(loc));
    });
  }

  private matchesFeatures(place: MemoryPlace): boolean {
    return this.selectedFilters.features.some(feature => {
      switch (feature) {
        case 'sea':
          return place.description.toLowerCase().includes('biển') ||
                 place.name.toLowerCase().includes('biển') ||
                 place.detailedDescription?.toLowerCase().includes('biển');
        case 'mountain':
          return place.description.toLowerCase().includes('núi') ||
                 place.name.toLowerCase().includes('núi') ||
                 place.detailedDescription?.toLowerCase().includes('núi') ||
                 place.name.toLowerCase().includes('đèo');
        case 'historical':
          return place.description.toLowerCase().includes('di tích') ||
                 place.description.toLowerCase().includes('lịch sử') ||
                 place.name.toLowerCase().includes('đền') ||
                 place.name.toLowerCase().includes('chùa') ||
                 place.name.toLowerCase().includes('lăng');
        case 'market':
          return place.name.toLowerCase().includes('chợ');
        case 'food':
          return !!place.recommendedFood?.length ||
                 !!place.localFood?.length;
        default:
          return false;
      }
    });
  }

  onSearch(searchText: string): void {
    this.searchText = searchText;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return Object.values(this.selectedFilters).some(filters => filters.length > 0) || !!this.searchText;
  }

  getActiveFilters(): FilterTag[] {
    const tags: FilterTag[] = [];

    // Add location type filters
    this.selectedFilters.locationType?.forEach(type => {
      const locationTypeObj = this.locationTypes.find(t => t.value === type);
      if (locationTypeObj) {
        tags.push({
          type: 'locationType',
          value: type,
          label: `Loại: ${locationTypeObj.label}`
        });
      }
    });

    // Add region filters
    this.selectedFilters.region?.forEach(region => {
      const regionObj = this.regions.find(r => r.value === region);
      if (regionObj) {
        tags.push({
          type: 'region',
          value: region,
          label: `Khu vực: ${regionObj.label}`
        });
      }
    });

    // Add feature filters
    this.selectedFilters.features?.forEach(feature => {
      const featureObj = this.features.find(f => f.value === feature);
      if (featureObj) {
        tags.push({
          type: 'feature',
          value: feature,
          label: `Đặc điểm: ${featureObj.label}`
        });
      }
    });

    // Add search text if present
    if (this.searchText) {
      tags.push({
        type: 'search',
        value: this.searchText,
        label: `Tìm kiếm: ${this.searchText}`
      });
    }

    return tags;
  }

  removeFilter(filter: FilterTag): void {
    switch (filter.type) {
      case 'locationType':
        this.selectedFilters.locationType = this.selectedFilters.locationType.filter(t => t !== filter.value);
        break;
      case 'region':
        this.selectedFilters.region = this.selectedFilters.region.filter(r => r !== filter.value);
        break;
      case 'feature':
        this.selectedFilters.features = this.selectedFilters.features.filter(f => f !== filter.value);
        break;
      case 'search':
        this.searchText = '';
        break;
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.isResetting = true;

    // Add a small delay to show the loading state
    setTimeout(() => {
      this.selectedFilters = {
        region: [],
        features: [],
        locationType: []
      };
      this.searchText = '';

      // Clear URL query params
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });

      this.applyFilters();
      this.isResetting = false;
    }, 300);
  }

  getAllPlaceNames(): string[] {
    return this.places.map(place => place.name);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleFilterCollapse() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
    if (this.isMobile) {
      // Only manipulate body overflow when on mobile
      document.body.style.overflow = this.isFilterCollapsed ? '' : 'hidden';
    }
  }

  closeFilterModal(event: MouseEvent) {
    if (this.isMobile && event.target === event.currentTarget) {
      this.isFilterCollapsed = true;
      document.body.style.overflow = '';
    }
  }

  trackByPlace(index: number, place: MemoryPlace): string {
    return place.id;
  }

  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredPlaces.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPlaces = this.filteredPlaces.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.scrollToTop();
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  changeItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  private scrollToTop(): void {
    const element = document.querySelector('.main-content');
    if (element) {
      element.scrollTop = 0;
    }
  }

  private sortPlaces(places: MemoryPlace[]): MemoryPlace[] {
    if (this.sortMode === 'none') {
      return places;
    }
    return [...places].sort((a, b) => {
      const nameA = removeVietnameseTones(a.name.toLowerCase());
      const nameB = removeVietnameseTones(b.name.toLowerCase());
      return this.sortMode === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  toggleSort(): void {
    switch (this.sortMode) {
      case 'none':
        this.sortMode = 'asc';
        break;
      case 'asc':
        this.sortMode = 'desc';
        break;
      case 'desc':
        this.sortMode = 'none';
        break;
    }
    this.applyFilters();
  }

  navigateToDetail(placeId: string): void {
    this.router.navigate(['/place', placeId]);
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 768;
    // Don't manipulate body overflow on initial load
    if (!this.isMobile) {
      document.body.style.overflow = '';
    }
  }
}
