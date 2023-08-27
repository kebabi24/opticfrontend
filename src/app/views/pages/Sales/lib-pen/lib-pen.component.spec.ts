import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibPenComponent } from './lib-pen.component';

describe('LibPenComponent', () => {
  let component: LibPenComponent;
  let fixture: ComponentFixture<LibPenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibPenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibPenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
