import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActivitylistComponent } from './customer-activitylist.component';

describe('CustomerActivitylistComponent', () => {
  let component: CustomerActivitylistComponent;
  let fixture: ComponentFixture<CustomerActivitylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerActivitylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerActivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
