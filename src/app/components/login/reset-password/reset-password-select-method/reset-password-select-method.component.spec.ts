import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordSelectMethodComponent } from './reset-password-select-method.component';

describe('ResetPasswordSelectMethodComponent', () => {
  let component: ResetPasswordSelectMethodComponent;
  let fixture: ComponentFixture<ResetPasswordSelectMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordSelectMethodComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordSelectMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
