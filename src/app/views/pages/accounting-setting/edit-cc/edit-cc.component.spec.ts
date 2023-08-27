import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCcComponent } from './edit-cc.component';

describe('EditCcComponent', () => {
  let component: EditCcComponent;
  let fixture: ComponentFixture<EditCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
