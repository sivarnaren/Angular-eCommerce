import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordStep1Component } from './reset-password-step1.component';

describe('ResetPasswordStep1Component', () => {
  let component: ResetPasswordStep1Component;
  let fixture: ComponentFixture<ResetPasswordStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
