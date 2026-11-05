import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnhYeuThichComponent } from './anh-yeu-thich.component';

describe('AnhYeuThichComponent', () => {
  let component: AnhYeuThichComponent;
  let fixture: ComponentFixture<AnhYeuThichComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnhYeuThichComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnhYeuThichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
