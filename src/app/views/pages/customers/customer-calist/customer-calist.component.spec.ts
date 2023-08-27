import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCAlistComponent } from './customer-calist.component';

describe('CustomerCAlistComponent', () => {
  let component: CustomerCAlistComponent;
  let fixture: ComponentFixture<CustomerCAlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCAlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCAlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
