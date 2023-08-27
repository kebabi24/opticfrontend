import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkCenterComponent } from './list-work-center.component';

describe('ListWorkCenterComponent', () => {
  let component: ListWorkCenterComponent;
  let fixture: ComponentFixture<ListWorkCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
