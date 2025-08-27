import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss']
})
export class SectionContainerComponent {
  @Input() title: string = '';
  @Input() icon?: string;
  @Input() class?: string;
  @Input() headerIcon?: string;
  @Input() headerIconClass?: string = 'message-icon';
  @Input() theme: 'pink' | 'blue' = 'blue';
} 