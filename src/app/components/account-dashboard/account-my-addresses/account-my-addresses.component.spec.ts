import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMyAddressesComponent } from './account-my-addresses.component';

describe('AccountMyAddressesComponent', () => {
  let component: AccountMyAddressesComponent;
  let fixture: ComponentFixture<AccountMyAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMyAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMyAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
