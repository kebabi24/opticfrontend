import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStatusPoComponent } from './edit-status-po.component';

describe('EditStatusPoComponent', () => {
  let component: EditStatusPoComponent;
  let fixture: ComponentFixture<EditStatusPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStatusPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStatusPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
