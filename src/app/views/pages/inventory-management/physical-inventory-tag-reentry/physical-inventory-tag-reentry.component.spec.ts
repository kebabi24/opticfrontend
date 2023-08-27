import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalInventoryTagReentryComponent } from './physical-inventory-tag-reentry.component';

describe('PhysicalInventoryTagReentryComponent', () => {
  let component: PhysicalInventoryTagReentryComponent;
  let fixture: ComponentFixture<PhysicalInventoryTagReentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalInventoryTagReentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalInventoryTagReentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
