import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoissEntryComponent } from './woiss-entry.component';

describe('WoissEntryComponent', () => {
  let component: WoissEntryComponent;
  let fixture: ComponentFixture<WoissEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoissEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoissEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
