import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVhComponent } from './list-vh.component';

describe('ListVhComponent', () => {
  let component: ListVhComponent;
  let fixture: ComponentFixture<ListVhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
