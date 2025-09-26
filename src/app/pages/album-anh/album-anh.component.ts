import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Album, AlbumData, AlbumDataResponse } from '../../shared/models';

@Component({
  selector: 'app-album-anh',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './album-anh.component.html',
  styleUrls: ['./album-anh.component.scss']
})
export class AlbumAnhComponent implements OnInit {
  albums: Album[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'default' | 'name' | 'photos' | 'date' = 'default';
  previewPhotos: string[] = [];
  favoriteAlbums: Set<string> = new Set();

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
      
      // Generate preview photos once after data is loaded
      this.previewPhotos = this.generateRandomPreviewPhotos(6);
    } catch (error) {
      console.error('Error loading album data:', error);
    }
  }

  getTotalPhotos(): number {
    return this.albums.reduce((total, album) => total + (album.photoCount || 0), 0);
  }

  private generateRandomPreviewPhotos(count: number): string[] {
    const allPhotos = this.albums.flatMap(album => [album.coverImage]);
    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  openAlbum(id: string) {
    this.router.navigate(['/album-anh', id]);
  }

  // New methods for enhanced functionality
  getYearsOfMemories(): number {
    const currentYear = new Date().getFullYear();
    const startYear = 2018; // Assuming memories started in 2018
    return currentYear - startYear + 1;
  }

  getSortedAlbums(): Album[] {
    const sorted = [...this.albums];
    
    switch (this.sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'photos':
        return sorted.sort((a, b) => (b.photoCount || 0) - (a.photoCount || 0));
      case 'date':
        return sorted.sort((a, b) => a.id.localeCompare(b.id)); // Assuming ID contains date info
      default:
        return sorted;
    }
  }

  onSortChange(): void {
    // Trigger change detection
  }

  trackByAlbum(index: number, album: Album): string {
    return album.id;
  }

  getAlbumDate(album: Album): string {
    // Extract date from album ID or use default
    const year = album.id.includes('2024') ? '2024' : 
                 album.id.includes('2023') ? '2023' : '2022';
    return `Năm ${year}`;
  }

  // New methods for enhanced list view
  getAlbumPreviews(album: Album): string[] {
    // Return 3 preview images (mock data - you can replace with actual album photos)
    return [album.coverImage, album.coverImage, album.coverImage].slice(0, 3);
  }

  getAlbumCategory(album: Album): string {
    // Mock categories based on album title
    if (album.title.includes('Cưới') || album.title.includes('Wedding')) return 'Đám cưới';
    if (album.title.includes('Du lịch') || album.title.includes('Travel')) return 'Du lịch';
    if (album.title.includes('Gia đình') || album.title.includes('Family')) return 'Gia đình';
    return 'Kỷ niệm';
  }

  getViewCount(album: Album): number {
    // Mock view count
    return Math.floor(Math.random() * 500) + 100;
  }

  getLikeCount(album: Album): number {
    // Mock like count
    return Math.floor(Math.random() * 50) + 10;
  }

  isFavorite(album: Album): boolean {
    return this.favoriteAlbums.has(album.id);
  }

  toggleFavorite(album: Album, event: Event): void {
    event.stopPropagation();
    if (this.favoriteAlbums.has(album.id)) {
      this.favoriteAlbums.delete(album.id);
    } else {
      this.favoriteAlbums.add(album.id);
    }
  }

  shareAlbum(album: Album, event: Event): void {
    event.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: album.description,
        url: window.location.href + '/' + album.id
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href + '/' + album.id);
    }
  }
}
