import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-detail-header',
  templateUrl: './album-detail-header.component.html',
  standalone: true,
  imports: [
    CommonModule,
  ],
  styleUrls: ['./album-detail-header.component.scss']
})
export class AlbumDetailHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() coverImage: string = '';
  @Input() photoCount: number = 0;
  @Input() date: Date = new Date();
  @Input() previewPhotos: string[] = [];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
