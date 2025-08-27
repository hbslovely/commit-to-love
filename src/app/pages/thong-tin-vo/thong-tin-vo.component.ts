import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProfileDetailComponent } from '../../shared/components/profile-detail/profile-detail.component';
import { Profile } from '../../shared/models/profile.model';
import { ProfileMapperService } from '../../shared/services/profile-mapper.service';

@Component({
  selector: 'app-thong-tin-vo',
  standalone: true,
  imports: [CommonModule, ProfileDetailComponent],
  templateUrl: './thong-tin-vo.component.html',
  styleUrls: ['./thong-tin-vo.component.scss']
})
export class ThongTinVoComponent implements OnInit {
  wifeProfile!: Profile;
  funFacts: any[] = [];

  constructor(
    private http: HttpClient,
    private profileMapper: ProfileMapperService
  ) {}

  ngOnInit() {
    // Load wife's profile data
    this.http.get('assets/data/wife-data.json').subscribe((data: any) => {
      this.wifeProfile = this.profileMapper.mapToProfile(data);
      this.funFacts = data.funFacts || [];
    });
  }
}
