import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-anh-yeu-thich',
  imports: [CommonModule],
  templateUrl: './anh-yeu-thich.component.html',
  styleUrls: ['./anh-yeu-thich.component.scss']
})
export class AnhYeuThichComponent implements OnInit {
  
  favoritePhotos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFavoritePhotos();
  }

  private loadFavoritePhotos() {
    this.http.get<any>('assets/data/favorite-photos-data.json').subscribe({
      next: (data) => {
        this.favoritePhotos = data.favoritePhotos;
      },
      error: (error) => {
        console.error('Error loading favorite photos:', error);
        this.setFallbackData();
      }
    });
  }

  private setFallbackData() {
    this.favoritePhotos = [
      { id: 1, src: 'assets/images/ki-niem/img.png', title: 'Lần đầu gặp nhau', reason: 'Khoảnh khắc định mệnh khiến chúng em yêu nhau' },
      { id: 2, src: 'assets/images/ki-niem/img_1.png', title: 'Ngày đầu hẹn hò', reason: 'Cảm giác tim đập thình thịch khi bên nhau' },
      { id: 3, src: 'assets/images/ki-niem/img_2.png', title: 'Chuyến đi đầu tiên', reason: 'Khám phá thế giới cùng nhau thật tuyệt vời' }
    ];
  }
}
