import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryByStatuslistComponent } from './inventory-by-statuslist.component';

describe('InventoryByStatuslistComponent', () => {
  let component: InventoryByStatuslistComponent;
  let fixture: ComponentFixture<InventoryByStatuslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryByStatuslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryByStatuslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
