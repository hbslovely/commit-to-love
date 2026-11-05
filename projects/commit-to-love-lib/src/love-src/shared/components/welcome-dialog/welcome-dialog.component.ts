import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.scss'],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'scale(0.7) translateY(30px) rotateX(10deg)',
          filter: 'blur(2px)'
        }),
        animate('0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ 
            opacity: 1, 
            transform: 'scale(1) translateY(0) rotateX(0deg)',
            filter: 'blur(0px)'
          })
        )
      ]),
      transition(':leave', [
        animate('0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)', 
          style({ 
            opacity: 0, 
            transform: 'scale(0.85) translateY(-20px) rotateX(-5deg)',
            filter: 'blur(1px)'
          })
        )
      ])
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0, backdropFilter: 'blur(0px)' }),
        animate('0.5s ease-out', style({ opacity: 1, backdropFilter: 'blur(8px)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, backdropFilter: 'blur(0px)' }))
      ])
    ])
  ]
})
export class WelcomeDialogComponent implements OnInit, OnDestroy {
  isVisible = false;
  private readonly STORAGE_KEY = 'welcome-dialog-shown';
  private readonly EXPIRY_HOURS = 24; // Dialog will show again after 24 hours

  ngOnInit() {
    this.checkAndShowDialog();
  }

  ngOnDestroy() {
    // Clean up any timers if needed
  }

  private checkAndShowDialog() {
    const lastShown = localStorage.getItem(this.STORAGE_KEY);
    
    if (!lastShown) {
      // First visit - show dialog after a short delay
      setTimeout(() => {
        this.isVisible = true;
      }, 1000);
    } else {
      // Check if enough time has passed
      const lastShownTime = parseInt(lastShown);
      const currentTime = Date.now();
      const hoursElapsed = (currentTime - lastShownTime) / (1000 * 60 * 60);
      
      if (hoursElapsed >= this.EXPIRY_HOURS) {
        setTimeout(() => {
          this.isVisible = true;
        }, 1000);
      }
    }
  }

  closeDialog() {
    this.isVisible = false;
    // Save timestamp to localStorage
    localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
  }

  onOverlayClick(event: Event) {
    // Close dialog when clicking on overlay (not the dialog content)
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('vi-VN', options);
  }
}
