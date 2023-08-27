import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWoComponent } from './list-wo.component';

describe('ListWoComponent', () => {
  let component: ListWoComponent;
  let fixture: ComponentFixture<ListWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
