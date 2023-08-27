import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentRapComponent } from './list-payment-rap.component';

describe('ListPaymentRapComponent', () => {
  let component: ListPaymentRapComponent;
  let fixture: ComponentFixture<ListPaymentRapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPaymentRapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaymentRapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
