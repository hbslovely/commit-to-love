import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models/profile.model';
import { SweetMomentsComponent } from '../sweet-moments/sweet-moments.component';
import { SectionContainerComponent } from '../section-container/section-container.component';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule, SweetMomentsComponent, SectionContainerComponent, ProfileHeaderComponent],
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent {
  @Input() profile!: Profile;
  @Input() themeClass: string = '';
  @Input() funFacts: any[] = [];
}
