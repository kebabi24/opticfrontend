import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorctEntryComponent } from './worct-entry.component';

describe('WorctEntryComponent', () => {
  let component: WorctEntryComponent;
  let fixture: ComponentFixture<WorctEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorctEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorctEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
