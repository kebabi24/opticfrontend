import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustHistComponent } from './cust-hist.component';

describe('CustHistComponent', () => {
  let component: CustHistComponent;
  let fixture: ComponentFixture<CustHistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustHistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
