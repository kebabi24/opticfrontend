import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlComponent } from './edit-gl.component';

describe('EditGlComponent', () => {
  let component: EditGlComponent;
  let fixture: ComponentFixture<EditGlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
