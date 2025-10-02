import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  scrollToTop(): void {
    // Multiple approaches to ensure scroll works
    this.scrollToPosition(0, 0);
  }

  scrollToPosition(x: number, y: number): void {
    // Method 1: Standard window.scrollTo
    if (window.scrollTo) {
      window.scrollTo(x, y);
    }

    // Method 2: Direct element scrolling
    if (document.body) {
      document.body.scrollTop = y;
    }
    
    if (document.documentElement) {
      document.documentElement.scrollTop = y;
    }

    // Method 3: Using scrollIntoView on body
    if (document.body && y === 0) {
      try {
        document.body.scrollIntoView({ 
          behavior: 'auto', 
          block: 'start',
          inline: 'start'
        });
      } catch (e) {
        // Fallback if scrollIntoView fails
        document.body.scrollTop = 0;
      }
    }

    // Method 4: Force scroll using requestAnimationFrame
    requestAnimationFrame(() => {
      window.scrollTo(x, y);
      document.body.scrollTop = y;
      document.documentElement.scrollTop = y;
    });
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'start'
      });
    }
  }

  getScrollPosition(): { x: number, y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    };
  }
}

