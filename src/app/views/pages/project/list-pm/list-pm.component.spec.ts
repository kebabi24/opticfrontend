import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPmComponent } from './list-pm.component';

describe('ListPmComponent', () => {
  let component: ListPmComponent;
  let fixture: ComponentFixture<ListPmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
