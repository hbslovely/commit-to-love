import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-happy-moments',
  templateUrl: './happy-moments.component.html',
  styleUrls: ['./happy-moments.component.scss']
})
export class HappyMomentsComponent implements OnInit {
  constructor(private titleService: TitleService) {}

  ngOnInit() {
    this.titleService.setTitle('✨ Khoảnh Khắc Hạnh Phúc');
  }
} 