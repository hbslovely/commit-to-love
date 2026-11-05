import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProfileDetailComponent } from '../../shared/components/profile-detail/profile-detail.component';
import { Profile, ProfileData } from '../../shared/models/profile.model';
import { ProfileMapperService } from '../../shared/services/profile-mapper.service';

@Component({
  selector: 'app-thong-tin-chong',
  standalone: true,
  imports: [CommonModule, ProfileDetailComponent],
  templateUrl: './thong-tin-chong.component.html',
  styleUrls: ['./thong-tin-chong.component.scss']
})
export class ThongTinChongComponent implements OnInit {
  husbandProfile!: Profile;
  funFacts: any[] = [];

  constructor(
    private http: HttpClient,
    private profileMapper: ProfileMapperService
  ) {}

  ngOnInit() {
    // Load husband's profile data
    this.http.get('assets/data/husband-data.json').subscribe((data: any) => {
      this.husbandProfile = this.profileMapper.mapToProfile(data);
      this.funFacts = data.funFacts || [];
    });
  }
}
