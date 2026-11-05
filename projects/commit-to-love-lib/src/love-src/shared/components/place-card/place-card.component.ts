import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MemoryPlace } from '../../models';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss']
})
export class PlaceCardComponent {
  @Input() place!: MemoryPlace;
  @Input() compact = false;

  private features = [
    { label: 'Biển', value: 'sea', icon: 'pi pi-cloud' },
    { label: 'Núi', value: 'mountain', icon: 'pi pi-chart-line' },
    { label: 'Di tích', value: 'historical', icon: 'pi pi-building' },
    { label: 'Chợ', value: 'market', icon: 'pi pi-shopping-cart' },
    { label: 'Ẩm thực', value: 'food', icon: 'pi pi-star' }
  ];

  constructor(private router: Router) {}

  navigateToDetail() {
    this.router.navigate(['/place', this.place.id]);
  }

  getFeatureIcon(feature: string): string {
    const featureObj = this.features.find(f => f.value === feature);
    return featureObj ? featureObj.icon : 'pi pi-star';
  }

  getFeatureLabel(feature: string): string {
    const featureObj = this.features.find(f => f.value === feature);
    return featureObj ? featureObj.label : feature;
  }
}
