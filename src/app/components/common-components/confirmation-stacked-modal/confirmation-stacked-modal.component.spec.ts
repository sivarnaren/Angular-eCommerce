import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationStackedModalComponent } from './confirmation-stacked-modal.component';

describe('ConfirmationStackedModalComponent', () => {
  let component: ConfirmationStackedModalComponent;
  let fixture: ComponentFixture<ConfirmationStackedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationStackedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationStackedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
