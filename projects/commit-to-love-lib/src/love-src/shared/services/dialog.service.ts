import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogData {
  id: string;
  title: string;
  content: string;
  type: 'love-stats' | 'calendar' | 'notes' | 'share';
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new BehaviorSubject<DialogData | null>(null);
  public dialog$ = this.dialogSubject.asObservable();

  openDialog(data: DialogData) {
    this.dialogSubject.next(data);
  }

  closeDialog() {
    this.dialogSubject.next(null);
  }

  // Predefined dialogs for footer features
  openLoveStatsDialog() {
    this.openDialog({
      id: 'love-stats',
      title: 'Thống Kê Tình Yêu',
      content: 'love-stats',
      type: 'love-stats'
    });
  }

  openCalendarDialog() {
    this.openDialog({
      id: 'calendar',
      title: 'Lịch Kỷ Niệm',
      content: 'calendar',
      type: 'calendar'
    });
  }

  openNotesDialog() {
    this.openDialog({
      id: 'notes',
      title: 'Ghi Chú Yêu Thương',
      content: 'notes',
      type: 'notes'
    });
  }

  openShareDialog() {
    this.openDialog({
      id: 'share',
      title: 'Chia Sẻ',
      content: 'share',
      type: 'share'
    });
  }
}

