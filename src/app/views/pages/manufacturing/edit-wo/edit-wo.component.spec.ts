import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWoComponent } from './edit-wo.component';

describe('EditWoComponent', () => {
  let component: EditWoComponent;
  let fixture: ComponentFixture<EditWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
