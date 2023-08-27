import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPrhComponent } from './pay-prh.component';

describe('PayPrhComponent', () => {
  let component: PayPrhComponent;
  let fixture: ComponentFixture<PayPrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayPrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
