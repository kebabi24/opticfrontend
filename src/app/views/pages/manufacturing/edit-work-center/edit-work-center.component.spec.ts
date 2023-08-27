import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkCenterComponent } from './edit-work-center.component';

describe('EditWorkCenterComponent', () => {
  let component: EditWorkCenterComponent;
  let fixture: ComponentFixture<EditWorkCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
