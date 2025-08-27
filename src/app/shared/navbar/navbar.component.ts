import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface MenuItem {
  text: string;
  link: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  menuItems: MenuItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  private loadMenuItems() {
    this.http.get<{menuItems: MenuItem[]}>('assets/data/navigation.json')
      .subscribe(data => {
        this.menuItems = data.menuItems;
      });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  getShortText(text: string): string {
    const textMap: { [key: string]: string } = {
      'Trang Chủ Yêu Thương': 'Xin Chào Bạn!',
      'Chuyện Tình Đẹp': 'Về Chúng Tôi',
      'Nàng Thơ Của Anh': 'Về Em Ấy',
      'Chàng Trai Của Em': 'Về Anh Ấy',
      'Khoảnh Khắc Yêu Thương': 'Album Ảnh',
    };
    return textMap[text] || text;
  }
}
