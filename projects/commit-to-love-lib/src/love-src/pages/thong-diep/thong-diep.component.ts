import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-thong-diep',
  imports: [CommonModule, FormsModule, ButtonModule, TextareaModule],
  templateUrl: './thong-diep.component.html',
  styleUrls: [ './thong-diep.component.scss' ],
})
export class ThongDiepComponent {
  message = '';
  messages: string[] = [];

  constructor() {
    this.loadMessages();
  }

  sendMessage() {
    if (this.message.trim()) {
      this.messages.push(this.message.trim());
      localStorage.setItem('messages', JSON.stringify(this.messages));
      this.message = '';
    }
  }

  loadMessages() {
    this.messages = JSON.parse(localStorage.getItem('messages') || '[]');
  }
}
