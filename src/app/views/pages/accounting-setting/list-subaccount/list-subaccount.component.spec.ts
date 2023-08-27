import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubaccountComponent } from './list-subaccount.component';

describe('ListSubaccountComponent', () => {
  let component: ListSubaccountComponent;
  let fixture: ComponentFixture<ListSubaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
