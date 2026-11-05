import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Empty shell — only hosts the feeding lazy route. */
@Component({
  selector: 'app-feeding-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class FeedingRootComponent {}
