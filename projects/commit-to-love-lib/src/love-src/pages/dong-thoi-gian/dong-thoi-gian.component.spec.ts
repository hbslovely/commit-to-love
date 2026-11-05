import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DongThoiGianComponent } from './dong-thoi-gian.component';

describe('DongThoiGianComponent', () => {
  let component: DongThoiGianComponent;
  let fixture: ComponentFixture<DongThoiGianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DongThoiGianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DongThoiGianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
