import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVideoComponent } from './product-video.component';

describe('ProductVideoComponent', () => {
  let component: ProductVideoComponent;
  let fixture: ComponentFixture<ProductVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
