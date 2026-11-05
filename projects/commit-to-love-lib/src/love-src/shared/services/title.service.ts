import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly mainTitle = 'Nhật Ký Tình Yêu Của Chúng Mình';
  private readonly titleSeparator = ' | ';

  constructor(private titleService: Title) {}

  /**
   * Sets the page title with an optional sub-title
   * @param subTitle The sub-title to append to the main title
   */
  setTitle(subTitle?: string): void {
    if (subTitle) {
      this.titleService.setTitle(`${this.mainTitle}${this.titleSeparator}${subTitle}`);
    } else {
      this.titleService.setTitle(this.mainTitle);
    }
  }

  /**
   * Gets the current page title
   */
  getTitle(): string {
    return this.titleService.getTitle();
  }
} 