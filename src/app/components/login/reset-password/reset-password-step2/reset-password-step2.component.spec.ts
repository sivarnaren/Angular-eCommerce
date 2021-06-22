import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordStep2Component } from './reset-password-step2.component';

describe('ResetPasswordStep2Component', () => {
  let component: ResetPasswordStep2Component;
  let fixture: ComponentFixture<ResetPasswordStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
