import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoComponent } from './edit-so.component';

describe('EditSoComponent', () => {
  let component: EditSoComponent;
  let fixture: ComponentFixture<EditSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
