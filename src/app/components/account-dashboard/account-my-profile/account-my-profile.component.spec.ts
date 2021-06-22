import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMyProfileComponent } from './account-my-profile.component';

describe('AccountMyProfileComponent', () => {
  let component: AccountMyProfileComponent;
  let fixture: ComponentFixture<AccountMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
