import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Empty shell — only hosts the love lazy routes. Uses `app-root` to match index.html. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class LoveRootComponent {}
