import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  totalPhotos = 0;
  totalPlaces = 0;
  daysTogether = 0;

  constructor() {}

  ngOnInit() {
    this.calculateStats();
  }

  private calculateStats() {
    // Calculate days together (example: from a specific start date)
    const startDate = new Date('2020-01-01'); // Adjust this to your actual start date
    const today = new Date();
    const timeDiff = today.getTime() - startDate.getTime();
    this.daysTogether = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Mock data for photos and places - you can replace with actual data
    this.totalPhotos = 1247;
    this.totalPlaces = 89;
  }

} 