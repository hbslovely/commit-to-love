import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoveStatistics } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-love-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './love-statistics.component.html',
  styleUrls: ['./love-statistics.component.scss']
})
export class LoveStatisticsComponent {
  @Input() statistics: LoveStatistics = {
    daysTogether: 0,
    photosTaken: 0,
    placesVisited: 0
  };
  constructor(
    private router: Router,
  ) {}

  navigateToPage(route: string) {
    this.router.navigate([route]);
  }
}
