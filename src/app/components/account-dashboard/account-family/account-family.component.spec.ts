import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFamilyComponent } from './account-family.component';

describe('AccountFamilyComponent', () => {
  let component: AccountFamilyComponent;
  let fixture: ComponentFixture<AccountFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
