import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputInvoiceComponent } from './input-invoice.component';

describe('InputInvoiceComponent', () => {
  let component: InputInvoiceComponent;
  let fixture: ComponentFixture<InputInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
