import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectInvoiceComponent } from './create-direct-invoice.component';

describe('CreateDirectInvoiceComponent', () => {
  let component: CreateDirectInvoiceComponent;
  let fixture: ComponentFixture<CreateDirectInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDirectInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
