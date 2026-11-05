import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import {
  NavbarComponent,
  FooterComponent,
  WelcomeDialogComponent,
  ScrollService,
} from '@hbslovely/commit-to-love';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';

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
    WelcomeDialogComponent,
  ],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(20px)', overflow: 'hidden' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'translateY(0)', overflow: 'visible' })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'commit-to-love';

  constructor(
    private router: Router,
    private scrollService: ScrollService,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.scrollService.scrollToTop(), 0);
        this.scrollService.scrollToTop();
        setTimeout(() => this.scrollService.scrollToTop(), 100);
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData;
  }
}
