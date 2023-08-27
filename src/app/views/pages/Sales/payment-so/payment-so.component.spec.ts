import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSoComponent } from './payment-so.component';

describe('PaymentSoComponent', () => {
  let component: PaymentSoComponent;
  let fixture: ComponentFixture<PaymentSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
