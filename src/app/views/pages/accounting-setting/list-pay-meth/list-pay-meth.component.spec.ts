import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPayMethComponent } from './list-pay-meth.component';

describe('ListPayMethComponent', () => {
  let component: ListPayMethComponent;
  let fixture: ComponentFixture<ListPayMethComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPayMethComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPayMethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
