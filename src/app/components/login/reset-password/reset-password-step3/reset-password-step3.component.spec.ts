import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordStep3Component } from './reset-password-step3.component';

describe('ResetPasswordStep3Component', () => {
  let component: ResetPasswordStep3Component;
  let fixture: ComponentFixture<ResetPasswordStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
