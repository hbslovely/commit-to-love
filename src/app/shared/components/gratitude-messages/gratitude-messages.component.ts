import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { EffectFade } from 'swiper/modules';

@Component({
  selector: 'app-gratitude-messages',
  templateUrl: './gratitude-messages.component.html',
  styleUrls: ['./gratitude-messages.component.scss']
})
export class GratitudeMessagesComponent implements OnInit, AfterViewInit {
  private swiper: Swiper | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper(): void {
    this.swiper = new Swiper('.swiper-container', {
      modules: [EffectFade],
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 600,
      allowTouchMove: false // Disable touch/swipe since we're using tabs
    });
  }

  switchLetter(index: number): void {
    if (this.swiper) {
      this.swiper.slideTo(index);
      // Update active tab
      const tabs = document.querySelectorAll('.tab-button');
      tabs.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }
  }
} 