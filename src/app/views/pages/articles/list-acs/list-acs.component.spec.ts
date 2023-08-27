import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcsComponent } from './list-acs.component';

describe('ListAcsComponent', () => {
  let component: ListAcsComponent;
  let fixture: ComponentFixture<ListAcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
