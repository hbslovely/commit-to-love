import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss']
})
export class PlaceCardComponent {
  @Input() place!: {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
  };
  @Input() compact = false;
}
