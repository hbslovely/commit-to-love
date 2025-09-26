import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogService, DialogData } from '../../services/dialog.service';
import { Subscription } from 'rxjs';

interface Note {
  content: string;
  date: Date;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DialogComponent implements OnInit, OnDestroy {
  dialogData: DialogData | null = null;
  private subscription: Subscription = new Subscription();
  
  // Notes functionality
  newNote: string = '';
  notes: Note[] = [
    { content: 'Hôm nay anh ấy mua cho em một bó hoa thật đẹp', date: new Date('2024-01-15') },
    { content: 'Chúng ta đã có buổi hẹn hò tuyệt vời tại quán cà phê', date: new Date('2024-01-10') },
    { content: 'Em rất yêu nụ cười của anh', date: new Date('2024-01-05') }
  ];

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.subscription = this.dialogService.dialog$.subscribe(data => {
      this.dialogData = data;
      if (data) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    document.body.style.overflow = 'auto';
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }

  addNote() {
    if (this.newNote.trim()) {
      this.notes.unshift({
        content: this.newNote.trim(),
        date: new Date()
      });
      this.newNote = '';
    }
  }
}

