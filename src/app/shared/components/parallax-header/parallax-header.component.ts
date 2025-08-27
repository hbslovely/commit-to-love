import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parallax-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parallax-header.component.html',
  styleUrls: ['./parallax-header.component.scss']
})
export class ParallaxHeaderComponent implements OnInit, OnDestroy {
  @Input() welcomeTexts: string[] = [
    'Welcome To Our Memories 💑',
    'Nơi Lưu Giữ Những Khoảnh Khắc Đẹp 💕',
    'Hành Trình Yêu Thương Của Hai Đứa 💝'
  ];

  @Input() startDate: Date = new Date('2021-05-09T19:30:02');

  currentText: string = '';
  textIndex: number = 0;
  charIndex: number = 0;

  liveCounter = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  private counterInterval: any;
  private typingInterval: any;
  private previousValues = { ...this.liveCounter };

  ngOnInit() {
    this.startLiveCounter();
    this.startTypingAnimation();
  }

  ngOnDestroy() {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  private startLiveCounter() {
    this.updateCounter();
    this.counterInterval = setInterval(() => {
      this.updateCounter();
    }, 1000);
  }

  private updateCounter() {
    const now = new Date();
    const diff = now.getTime() - this.startDate.getTime();

    // Lưu giá trị cũ
    this.previousValues = { ...this.liveCounter };

    // Tính toán giá trị mới
    this.liveCounter.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.liveCounter.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.liveCounter.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.liveCounter.seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Thêm hiệu ứng lật
    this.addFlipAnimation();
  }

  private startTypingAnimation() {
    this.typingInterval = setInterval(() => {
      if (this.charIndex < this.welcomeTexts[this.textIndex].length) {
        this.currentText = this.welcomeTexts[this.textIndex].slice(0, ++this.charIndex);
      } else {
        setTimeout(() => {
          this.charIndex = 0;
          this.textIndex = (this.textIndex + 1) % this.welcomeTexts.length;
          this.currentText = '';
        }, 2000);
      }
    }, 100);
  }

  private addFlipAnimation() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach((card: Element, index) => {
      const currentValue = Object.values(this.liveCounter)[index];
      const previousValue = Object.values(this.previousValues)[index];
      
      if (currentValue !== previousValue) {
        card.classList.add('flip');
        setTimeout(() => {
          card.classList.remove('flip');
        }, 600); // Match với thời gian transition trong CSS
      }
    });
  }
}
