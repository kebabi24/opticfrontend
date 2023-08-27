import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGammeComponent } from './edit-gamme.component';

describe('EditGammeComponent', () => {
  let component: EditGammeComponent;
  let fixture: ComponentFixture<EditGammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
