import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCAbyItemlistComponent } from './customer-caby-itemlist.component';

describe('CustomerCAbyItemlistComponent', () => {
  let component: CustomerCAbyItemlistComponent;
  let fixture: ComponentFixture<CustomerCAbyItemlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCAbyItemlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCAbyItemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
