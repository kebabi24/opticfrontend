import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRsnComponent } from './list-rsn.component';

describe('ListRsnComponent', () => {
  let component: ListRsnComponent;
  let fixture: ComponentFixture<ListRsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
