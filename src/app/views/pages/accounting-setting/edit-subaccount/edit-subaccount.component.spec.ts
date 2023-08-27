import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubaccountComponent } from './edit-subaccount.component';

describe('EditSubaccountComponent', () => {
  let component: EditSubaccountComponent;
  let fixture: ComponentFixture<EditSubaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
