import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryPharmacyComponent } from './primary-pharmacy.component';

describe('PrimaryPharmacyComponent', () => {
  let component: PrimaryPharmacyComponent;
  let fixture: ComponentFixture<PrimaryPharmacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryPharmacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
