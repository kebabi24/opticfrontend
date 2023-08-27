import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoSoComponent } from './undo-so.component';

describe('UndoSoComponent', () => {
  let component: UndoSoComponent;
  let fixture: ComponentFixture<UndoSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
