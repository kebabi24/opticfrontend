import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcsComponent } from './edit-acs.component';

describe('EditAcsComponent', () => {
  let component: EditAcsComponent;
  let fixture: ComponentFixture<EditAcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
