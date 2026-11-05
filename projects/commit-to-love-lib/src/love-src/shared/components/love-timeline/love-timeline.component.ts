import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface TimelineMoment {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  tags: string[];
  location: string;
}

@Component({
  selector: 'app-love-timeline',
  templateUrl: './love-timeline.component.html',
  styleUrls: ['./love-timeline.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class LoveTimelineComponent implements OnInit, OnDestroy {
  timelineMoments: TimelineMoment[] = [];
  loading = false;
  hasMoreMoments = false;
  currentPage = 1;
  itemsPerPage = 5;

  // Lightbox properties
  lightboxActive: boolean = false;
  selectedImage: TimelineMoment | null = null;
  currentLightboxIndex: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTimelineData();
    this.setupKeyboardListeners();
  }

  ngOnDestroy() {
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

  loadTimelineData() {
    this.loading = true;
    this.http.get<{moments: TimelineMoment[]}>('assets/data/timeline-moments.json')
      .subscribe({
        next: (data) => {
          // Sort moments by date in ascending order
          const sortedMoments = data.moments.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          // Calculate total pages
          const totalItems = sortedMoments.length;
          const startIndex = 0;
          const endIndex = Math.min(this.itemsPerPage, totalItems);

          // Set initial items
          this.timelineMoments = sortedMoments.slice(startIndex, endIndex);
          this.hasMoreMoments = endIndex < totalItems;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading timeline data:', error);
          this.loading = false;
        }
      });
  }

  getYearsCount(): number {
    // Calculate years since the first timeline moment or a default start date
    if (this.timelineMoments.length === 0) {
      return 1; // Default fallback
    }
    
    const firstMoment = new Date(this.timelineMoments[0].date);
    const currentDate = new Date();
    const yearsDiff = currentDate.getFullYear() - firstMoment.getFullYear();
    
    return Math.max(1, yearsDiff + 1);
  }

  // Lightbox methods
  openLightbox(moment: TimelineMoment) {
    this.selectedImage = moment;
    this.currentLightboxIndex = this.timelineMoments.findIndex(m => m.id === moment.id);
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
    if (this.currentLightboxIndex < this.timelineMoments.length - 1) {
      this.currentLightboxIndex++;
      this.selectedImage = this.timelineMoments[this.currentLightboxIndex];
    }
  }

  previousImage() {
    if (this.currentLightboxIndex > 0) {
      this.currentLightboxIndex--;
      this.selectedImage = this.timelineMoments[this.currentLightboxIndex];
    }
  }
}
