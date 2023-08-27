import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryActivitylistComponent } from './inventory-activitylist.component';

describe('InventoryActivitylistComponent', () => {
  let component: InventoryActivitylistComponent;
  let fixture: ComponentFixture<InventoryActivitylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryActivitylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryActivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
