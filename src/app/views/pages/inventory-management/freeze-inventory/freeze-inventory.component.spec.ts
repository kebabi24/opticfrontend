import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeInventoryComponent } from './freeze-inventory.component';

describe('FreezeInventoryComponent', () => {
  let component: FreezeInventoryComponent;
  let fixture: ComponentFixture<FreezeInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezeInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
