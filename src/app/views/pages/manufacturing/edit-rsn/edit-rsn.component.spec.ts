import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRsnComponent } from './edit-rsn.component';

describe('EditRsnComponent', () => {
  let component: EditRsnComponent;
  let fixture: ComponentFixture<EditRsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
