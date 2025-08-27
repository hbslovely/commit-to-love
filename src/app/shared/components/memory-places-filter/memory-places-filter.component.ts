import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-memory-places-filter',
  templateUrl: './memory-places-filter.component.html',
  styleUrls: ['./memory-places-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class MemoryPlacesFilterComponent {
  @Input() locationTypes: any[] = [];
  @Input() regions: any[] = [];
  @Input() features: any[] = [];
  @Input() selectedFilters: any = {
    locationType: [],
    region: [],
    features: []
  };
  @Input() searchText: string = '';
  @Input() isResetting: boolean = false;

  @Output() filterChange = new EventEmitter<{ type: string, value: string }>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() resetFilters = new EventEmitter<void>();

  private searchTimeout: any;

  onSearchInput(event: any): void {
    const value = event.target.value;
    
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Debounce search
    this.searchTimeout = setTimeout(() => {
      this.searchText = value;
      this.searchChange.emit(this.searchText);
    }, 300);
  }

  onSearchClear(): void {
    this.searchText = '';
    this.searchChange.emit(this.searchText);
  }

  toggleFilter(type: string, value: string): void {
    this.filterChange.emit({ type, value });
  }

  onResetFilters(): void {
    this.resetFilters.emit();
  }

  hasActiveFilters(): boolean {
    return this.selectedFilters.locationType.length > 0 ||
      this.selectedFilters.region.length > 0 ||
      this.selectedFilters.features.length > 0 ||
      !!this.searchText;
  }

  getActiveFiltersCount(): number {
    return (
      this.selectedFilters.locationType.length +
      this.selectedFilters.region.length +
      this.selectedFilters.features.length +
      (this.searchText ? 1 : 0)
    );
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}
