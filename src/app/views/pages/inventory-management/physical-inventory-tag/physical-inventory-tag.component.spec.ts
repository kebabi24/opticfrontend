import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalInventoryTagComponent } from './physical-inventory-tag.component';

describe('PhysicalInventoryTagComponent', () => {
  let component: PhysicalInventoryTagComponent;
  let fixture: ComponentFixture<PhysicalInventoryTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalInventoryTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalInventoryTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
