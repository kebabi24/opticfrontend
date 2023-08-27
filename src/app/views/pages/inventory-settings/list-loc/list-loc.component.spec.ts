import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLocComponent } from './list-loc.component';

describe('ListLocComponent', () => {
  let component: ListLocComponent;
  let fixture: ComponentFixture<ListLocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
