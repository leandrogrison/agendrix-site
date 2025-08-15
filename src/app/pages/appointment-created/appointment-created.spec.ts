import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCreated } from './appointment-created';

describe('AppointmentCreated', () => {
  let component: AppointmentCreated;
  let fixture: ComponentFixture<AppointmentCreated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCreated]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCreated);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
