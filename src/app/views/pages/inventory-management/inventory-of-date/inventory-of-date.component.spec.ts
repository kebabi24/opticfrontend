import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOfDateComponent } from './inventory-of-date.component';

describe('InventoryOfDateComponent', () => {
  let component: InventoryOfDateComponent;
  let fixture: ComponentFixture<InventoryOfDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryOfDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryOfDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
