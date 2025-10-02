import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent {
  @Input() isVisible = false;
  @Input() albumTitle = '';
  @Output() passwordSubmit = new EventEmitter<string>();
  @Output() modalClose = new EventEmitter<void>();

  password = '';
  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (!this.password.trim()) {
      this.errorMessage = 'Vui lòng nhập mật khẩu';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.passwordSubmit.emit(this.password);
  }

  onClose() {
    this.password = '';
    this.errorMessage = '';
    this.isLoading = false;
    this.modalClose.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  setError(message: string) {
    this.errorMessage = message;
    this.isLoading = false;
  }

  clearError() {
    this.errorMessage = '';
  }
}

