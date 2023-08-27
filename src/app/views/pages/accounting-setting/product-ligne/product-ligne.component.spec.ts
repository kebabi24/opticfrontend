import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLigneComponent } from './product-ligne.component';

describe('ProductLigneComponent', () => {
  let component: ProductLigneComponent;
  let fixture: ComponentFixture<ProductLigneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLigneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
