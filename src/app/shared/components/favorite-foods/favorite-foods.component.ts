import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { PersonFilterPipe } from '../../pipes/person-filter.pipe';
import { Food } from '../../models';

@Component({
  selector: 'app-favorite-foods',
  standalone: true,
  imports: [ CommonModule, ImageViewerComponent, PersonFilterPipe ],
  templateUrl: './favorite-foods.component.html',
  styleUrls: [ './favorite-foods.component.scss' ]
})
export class FavoriteFoodsComponent implements OnInit {
  foods: Food[] = [];

  selectedImage: { url: string; alt: string } | null = null;

  constructor(private http: HttpClient) {}

  openImageViewer(imageUrl: string, imageAlt: string) {
    this.selectedImage = { url: imageUrl, alt: imageAlt };
  }

  closeImageViewer() {
    this.selectedImage = null;
  }

  ngOnInit() {
    this.http.get<{ favoriteFoods: Food[] }>('assets/data/favorite-foods.json')
      .subscribe(data => {
        this.foods = data.favoriteFoods;
      });
  }
}
