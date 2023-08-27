import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalInventoryTagEntryComponent } from './physical-inventory-tag-entry.component';

describe('PhysicalInventoryTagEntryComponent', () => {
  let component: PhysicalInventoryTagEntryComponent;
  let fixture: ComponentFixture<PhysicalInventoryTagEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalInventoryTagEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalInventoryTagEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
