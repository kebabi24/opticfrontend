import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryByLoclistComponent } from './inventory-by-loclist.component';

describe('InventoryByLoclistComponent', () => {
  let component: InventoryByLoclistComponent;
  let fixture: ComponentFixture<InventoryByLoclistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryByLoclistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryByLoclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
