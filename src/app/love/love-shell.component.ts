import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FooterComponent,
  NavbarComponent,
  ScrollService,
  WelcomeDialogComponent,
} from '@hbslovely/commit-to-love';

@Component({
  selector: 'app-love-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    WelcomeDialogComponent,
  ],
  templateUrl: './love-shell.component.html',
  styleUrl: './love-shell.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(20px)', overflow: 'hidden' }),
        animate(
          '0.3s ease-in-out',
          style({ opacity: 1, transform: 'translateY(0)', overflow: 'visible' })
        ),
      ]),
    ]),
  ],
})
export class LoveShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);

  readonly floatingDots = Array.from({ length: 30 });

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.scrollService.scrollToTop(), 0);
        this.scrollService.scrollToTop();
        setTimeout(() => this.scrollService.scrollToTop(), 100);
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData;
  }
}
