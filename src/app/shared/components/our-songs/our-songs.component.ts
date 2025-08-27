import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Song {
  id: number;
  artist: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  category: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

@Component({
  selector: 'app-our-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-songs.component.html',
  styleUrls: ['./our-songs.component.scss']
})
export class OurSongsComponent implements OnInit, OnDestroy {
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  currentSong: Song | null = null;
  selectedCategory: string = 'Tất cả';
  categories: string[] = ['Tất cả'];
  player: any;
  private playerReady = false;
  private sanitizer = inject(DomSanitizer);

  constructor() {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.playerReady = true;
      if (this.currentSong) {
        this.initializePlayer(this.getYouTubeVideoId(this.currentSong.youtubeUrl));
      }
    };
  }

  ngOnInit() {
    fetch('assets/data/our-songs.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data.songs;
        this.filteredSongs = this.songs;

        const uniqueCategories = new Set(this.songs.map(song => song.category));
        this.categories = ['Tất cả', ...Array.from(uniqueCategories)];

        if (this.songs.length > 0) {
          this.playSong(this.songs[0]);
        }
      });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }

  getCurrentVideoUrl(): SafeResourceUrl {
    if (!this.currentSong) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const videoId = this.getYouTubeVideoId(this.currentSong.youtubeUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
    );
  }

  getYouTubeVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  initializePlayer(videoId: string) {
    if (!this.playerReady) return;

    if (this.player) {
      this.player.loadVideoById(videoId);
      return;
    }

    this.player = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0, // Disable autoplay
        controls: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onStateChange: (event: any) => this.onPlayerStateChange(event)
      }
    });
  }

  onPlayerStateChange(event: any) {
    // When video ends (state = 0), play next song
    if (event.data === 0) {
      this.playNextSong();
    }
  }

  playSong(song: Song): void {
    this.currentSong = song;
    const videoId = this.getYouTubeVideoId(song.youtubeUrl);

    if (this.playerReady) {
      this.initializePlayer(videoId);
    }
  }

  playNextSong(): void {
    if (!this.currentSong || !this.filteredSongs.length) return;

    const currentIndex = this.filteredSongs.findIndex(song => song.id === this.currentSong?.id);
    const nextIndex = (currentIndex + 1) % this.filteredSongs.length;
    this.playSong(this.filteredSongs[nextIndex]);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredSongs = category === 'Tất cả'
      ? this.songs
      : this.songs.filter(song => song.category === category);
  }
}
