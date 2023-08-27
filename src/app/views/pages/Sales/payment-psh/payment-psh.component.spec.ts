import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPshComponent } from './payment-psh.component';

describe('PaymentPshComponent', () => {
  let component: PaymentPshComponent;
  let fixture: ComponentFixture<PaymentPshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
