import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoEntriesComponent } from './mo-entries.component';

describe('MoEntriesComponent', () => {
  let component: MoEntriesComponent;
  let fixture: ComponentFixture<MoEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
