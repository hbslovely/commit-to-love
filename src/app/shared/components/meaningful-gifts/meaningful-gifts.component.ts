import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Gift {
  id: number;
  title: string;
  date: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-meaningful-gifts',
  templateUrl: './meaningful-gifts.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: [ './meaningful-gifts.component.scss' ]
})
export class MeaningfulGiftsComponent implements OnInit {
  gifts: Gift[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{gifts: Gift[]}>('assets/data/meaningful-gifts.json')
      .subscribe(data => {
        this.gifts = data.gifts;
      });
  }
}
