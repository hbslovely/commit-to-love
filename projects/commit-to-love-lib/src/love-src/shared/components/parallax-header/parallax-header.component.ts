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

  counterItems: Array<{
    value: string;
    label: string;
    shouldFlip: boolean;
  }> = [
    { value: '0', label: 'NGÀY', shouldFlip: false },
    { value: '00', label: 'GIỜ', shouldFlip: false },
    { value: '00', label: 'PHÚT', shouldFlip: false },
    { value: '00', label: 'GIÂY', shouldFlip: false }
  ];

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

    // Cập nhật counterItems với hiệu ứng flip
    this.updateCounterItems();
  }

  private updateCounterItems() {
    const values = [
      this.liveCounter.days.toString(),
      this.liveCounter.hours.toString().padStart(2, '0'),
      this.liveCounter.minutes.toString().padStart(2, '0'),
      this.liveCounter.seconds.toString().padStart(2, '0')
    ];

    const previousValues = [
      this.previousValues.days.toString(),
      this.previousValues.hours.toString().padStart(2, '0'),
      this.previousValues.minutes.toString().padStart(2, '0'),
      this.previousValues.seconds.toString().padStart(2, '0')
    ];

    values.forEach((value, index) => {
      if (value !== previousValues[index]) {
        this.counterItems[index].shouldFlip = true;
        setTimeout(() => {
          this.counterItems[index].value = value;
          this.counterItems[index].shouldFlip = false;
        }, 300);
      } else {
        this.counterItems[index].value = value;
      }
    });
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

}
