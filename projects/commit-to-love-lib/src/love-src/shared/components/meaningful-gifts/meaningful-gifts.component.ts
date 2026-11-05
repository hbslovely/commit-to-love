import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Gift {
  id: number;
  title: string;
  date: string;
  image: string;
  description: string;
  category?: string;
  occasion?: string;
  sentiment?: string;
}

@Component({
  selector: 'app-meaningful-gifts',
  templateUrl: './meaningful-gifts.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: [ './meaningful-gifts.component.scss' ]
})
export class MeaningfulGiftsComponent implements OnInit, OnDestroy {
  gifts: Gift[] = [];

  // Lightbox properties
  lightboxActive: boolean = false;
  selectedImage: Gift | null = null;
  currentLightboxIndex: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{gifts: Gift[]}>('assets/data/meaningful-gifts.json')
      .subscribe(data => {
        this.gifts = data.gifts;
      });
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

  selectGift(gift: Gift): void {
    this.openLightbox(gift);
  }

  // Lightbox methods
  openLightbox(gift: Gift) {
    this.selectedImage = gift;
    this.currentLightboxIndex = this.gifts.findIndex(g => g.id === gift.id);
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
    if (this.currentLightboxIndex < this.gifts.length - 1) {
      this.currentLightboxIndex++;
      this.selectedImage = this.gifts[this.currentLightboxIndex];
    }
  }

  previousImage() {
    if (this.currentLightboxIndex > 0) {
      this.currentLightboxIndex--;
      this.selectedImage = this.gifts[this.currentLightboxIndex];
    }
  }

  getYearsOfGifts(): number {
    if (this.gifts.length === 0) return 0;
    
    const dates = this.gifts.map(gift => new Date(gift.date));
    const minYear = Math.min(...dates.map(date => date.getFullYear()));
    const maxYear = Math.max(...dates.map(date => date.getFullYear()));
    
    return maxYear - minYear + 1;
  }
}
