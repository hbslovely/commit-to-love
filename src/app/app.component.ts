import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WelcomeDialogComponent } from './shared/components/welcome-dialog/welcome-dialog.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { ScrollService } from './shared/services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FooterComponent,
    WelcomeDialogComponent
  ],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(20px)', overflow: 'hidden' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'translateY(0)', overflow: 'visible' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'ky-niem-web';

  constructor(
    private router: Router,
    private scrollService: ScrollService
  ) {}

  ngOnInit() {
    // Scroll to top on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Use multiple approaches to ensure scroll works
      setTimeout(() => {
        this.scrollService.scrollToTop();
      }, 0);
      
      // Also try immediate scroll
      this.scrollService.scrollToTop();
      
      // Additional fallback with longer delay
      setTimeout(() => {
        this.scrollService.scrollToTop();
      }, 100);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData;
  }
}
