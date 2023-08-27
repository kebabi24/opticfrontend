import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionComponent } from './inventory-transaction.component';

describe('InventoryTransactionComponent', () => {
  let component: InventoryTransactionComponent;
  let fixture: ComponentFixture<InventoryTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
