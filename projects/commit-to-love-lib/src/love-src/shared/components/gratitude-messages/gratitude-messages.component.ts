import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { EffectFade } from 'swiper/modules';

interface Letter {
  id: number;
  sender: string;
  title: string;
  content: string;
  signature: string;
  date: string;
}

@Component({
  selector: 'app-gratitude-messages',
  templateUrl: './gratitude-messages.component.html',
  styleUrls: ['./gratitude-messages.component.scss'],
  standalone: true,
  imports: [CommonModule]
})

export class GratitudeMessagesComponent implements OnInit, AfterViewInit {
  private swiper: Swiper | undefined;
  currentLetter: number = 0;

  letters: Letter[] = [
    {
      id: 1,
      sender: 'wife',
      title: 'Thư Gửi Anh',
      content: 'Anh yêu của em, từ ngày gặp anh, cuộc đời em như được thắp sáng bởi ánh nắng ấm áp. Anh là người đã dạy em yêu thương, chia sẻ và cùng nhau xây dựng một tổ ấm hạnh phúc. Em biết ơn vì đã có anh trong cuộc đời này.',
      signature: 'Yêu anh nhiều',
      date: '2024-01-01'
    },
    {
      id: 2,
      sender: 'husband',
      title: 'Thư Gửi Em',
      content: 'Em yêu của anh, cảm ơn em đã luôn bên cạnh anh trong mọi hoàn cảnh. Em là nguồn động lực để anh cố gắng mỗi ngày, là lý do anh muốn trở thành phiên bản tốt nhất của chính mình. Anh hứa sẽ luôn yêu thương và bảo vệ em.',
      signature: 'Mãi yêu em',
      date: '2024-01-01'
    }
  ];

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
    this.currentLetter = index;
  }
} 