import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvglsListComponent } from './invgls-list.component';

describe('InvglsListComponent', () => {
  let component: InvglsListComponent;
  let fixture: ComponentFixture<InvglsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvglsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvglsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
