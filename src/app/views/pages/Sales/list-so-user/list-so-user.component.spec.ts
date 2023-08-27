import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSoUserComponent } from './list-so-user.component';

describe('ListSoUserComponent', () => {
  let component: ListSoUserComponent;
  let fixture: ComponentFixture<ListSoUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSoUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
