import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlassesComponent } from './edit-glasses.component';

describe('EditGlassesComponent', () => {
  let component: EditGlassesComponent;
  let fixture: ComponentFixture<EditGlassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGlassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGlassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
