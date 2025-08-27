import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-dong-thoi-gian',
  imports: [ CommonModule, TimelineModule ],
  templateUrl: './dong-thoi-gian.component.html',
  styleUrls: [ './dong-thoi-gian.component.scss' ]
})
export class DongThoiGianComponent {
  events = [
    { status: 'Lần đầu gặp gỡ', date: '15/02/2020', icon: 'pi pi-heart' },
    { status: 'Lời tỏ tình đầu tiên', date: '20/03/2020', icon: 'pi pi-star' },
    { status: 'Ngày Valentine đầu tiên', date: '14/02/2021', icon: 'pi pi-gift' },
    { status: 'Kỷ niệm 1 năm yêu nhau', date: '20/03/2021', icon: 'pi pi-heart-fill' },
    { status: 'Chuyến du lịch đầu tiên', date: '15/07/2021', icon: 'pi pi-plane' },
    { status: 'Ngày đính hôn', date: '10/10/2022', icon: 'pi pi-crown' },
    { status: 'Kế hoạch tương lai', date: '01/01/2024', icon: 'pi pi-home' }
  ];
}
