import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviseComponent } from './edit-devise.component';

describe('EditDeviseComponent', () => {
  let component: EditDeviseComponent;
  let fixture: ComponentFixture<EditDeviseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeviseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeviseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
