import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLeftModalComponent } from './time-left-modal.component';

describe('TimeLeftModalComponent', () => {
  let component: TimeLeftModalComponent;
  let fixture: ComponentFixture<TimeLeftModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLeftModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLeftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
