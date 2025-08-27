import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetMoment } from '../../models/profile.model';

@Component({
  selector: 'app-sweet-moments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sweet-moments.component.html',
  styleUrls: ['./sweet-moments.component.scss']
})
export class SweetMomentsComponent {
  @Input() moments: SweetMoment[] = [];
  @Input() theme: 'pink' | 'blue' = 'blue';
} 