import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ve-chung-toi',
  templateUrl: './ve-chung-toi.component.html',
  styleUrls: ['./ve-chung-toi.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class VeChungToiComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Set random heights for all images
    const figures = document.querySelectorAll('figure');
    figures.forEach(figure => {
      const randomHeight = Math.floor(Math.random() * (350 - 250 + 1) + 250);
      figure.style.setProperty('--random-height', `${randomHeight}px`);
    });
  }
}
