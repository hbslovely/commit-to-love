import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlbumGalleryImage } from '../../models';

@Component({
  selector: 'app-album-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-gallery.component.html',
  styleUrls: ['./album-gallery.component.scss']
})
export class AlbumGalleryComponent implements OnInit, OnDestroy {
  @Input() images: AlbumGalleryImage[] = [];
  @Output() imageClick = new EventEmitter<AlbumGalleryImage>();
  selectedIndex = 0;
  private autoPlayInterval: any;
  private readonly AUTO_PLAY_INTERVAL = 4000;
  isTransitioning = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  private normalizeImageData(image: AlbumGalleryImage): AlbumGalleryImage {
    return {
      src: image.src || image.url || '',
      name: image.name || image.title || '',
      description: image.description || '',
      caption: image.caption || ''
    };
  }

  selectImage(index: number) {
    if (index === this.selectedIndex) return;
    this.triggerTransition(() => {
      this.selectedIndex = index;
    });
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  onImageClick() {
    this.imageClick.emit(this.images[this.selectedIndex]);
  }

  private startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.triggerTransition(() => {
        this.nextImage();
      });
    }, this.AUTO_PLAY_INTERVAL);
  }

  private stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  nextImage() {
    if (this.images.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
    }
  }

  private triggerTransition(changeFn: () => void) {
    this.isTransitioning = true;
    setTimeout(() => {
      changeFn();
      this.isTransitioning = false;
    }, 350); // match CSS transition duration
  }
} 