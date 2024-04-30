import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPickerComponent } from './room-picker.component';

describe('RoomPickerComponent', () => {
  let component: RoomPickerComponent;
  let fixture: ComponentFixture<RoomPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomPickerComponent]
    });
    fixture = TestBed.createComponent(RoomPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
