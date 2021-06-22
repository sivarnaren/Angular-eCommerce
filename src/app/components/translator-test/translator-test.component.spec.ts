import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorTestComponent } from './translator-test.component';

describe('TranslatorTestComponent', () => {
  let component: TranslatorTestComponent;
  let fixture: ComponentFixture<TranslatorTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslatorTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
