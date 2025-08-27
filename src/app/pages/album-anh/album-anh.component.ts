import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlbumHeaderComponent } from './components/album-header/album-header.component';
import { Album, AlbumData, AlbumDataResponse } from '../../shared/models';

@Component({
  selector: 'app-album-anh',
  standalone: true,
  imports: [ CommonModule, AlbumHeaderComponent ],
  templateUrl: './album-anh.component.html',
  styleUrls: ['./album-anh.component.scss']
})
export class AlbumAnhComponent implements OnInit {
  albums: Album[] = [];
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      const response = await fetch('assets/data/album-data.json');
      const data: AlbumDataResponse = await response.json();
      this.albums = data.albums.map((album: AlbumData) => ({
        id: album.id,
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        photoCount: album.photos.length
      }));
    } catch (error) {
      console.error('Error loading album data:', error);
    }
  }

  getTotalPhotos(): number {
    return this.albums.reduce((total, album) => total + (album.photoCount || 0), 0);
  }

  getRandomPreviewPhotos(count: number): string[] {
    const allPhotos = this.albums.flatMap(album => [album.coverImage]);
    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  openAlbum(id: string) {
    this.router.navigate(['/album-anh', id]);
  }
}
