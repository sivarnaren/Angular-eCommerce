import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMyPlanComponent } from './select-my-plan.component';

describe('SelectMyPlanComponent', () => {
  let component: SelectMyPlanComponent;
  let fixture: ComponentFixture<SelectMyPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMyPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
