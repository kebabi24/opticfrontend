import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSoldelistComponent } from './customer-soldelist.component';

describe('CustomerSoldelistComponent', () => {
  let component: CustomerSoldelistComponent;
  let fixture: ComponentFixture<CustomerSoldelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSoldelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSoldelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
