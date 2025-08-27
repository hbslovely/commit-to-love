import { Component, OnInit } from '@angular/core';
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
export class LoveTimelineComponent implements OnInit {
  timelineMoments: TimelineMoment[] = [];
  loading = false;
  hasMoreMoments = false;
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTimelineData();
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
}
