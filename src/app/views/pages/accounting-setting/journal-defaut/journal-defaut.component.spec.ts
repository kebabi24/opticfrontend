import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalDefautComponent } from './journal-defaut.component';

describe('JournalDefautComponent', () => {
  let component: JournalDefautComponent;
  let fixture: ComponentFixture<JournalDefautComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalDefautComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalDefautComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
