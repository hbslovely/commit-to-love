import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeViewer(event: MouseEvent) {
    event.preventDefault();
    this.close.emit();
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
} 