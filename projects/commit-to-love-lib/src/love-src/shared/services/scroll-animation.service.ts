import { Injectable, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    // Handle initial animations on page load
    fromEvent(window, 'load')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checkElements();
      });

    // Handle animations on scroll
    fromEvent(window, 'scroll')
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.checkElements();
      });
  }

  private checkElements() {
    document.querySelectorAll('.animate-on-scroll:not(.animate)').forEach(element => {
      this.observer.observe(element);
    });
  }

  public observeElement(element: ElementRef) {
    if (element.nativeElement) {
      element.nativeElement.classList.add('animate-on-scroll');
      this.observer.observe(element.nativeElement);
    }
  }
} 