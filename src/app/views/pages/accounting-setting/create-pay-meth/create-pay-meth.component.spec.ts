import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePayMethComponent } from './create-pay-meth.component';

describe('CreatePayMethComponent', () => {
  let component: CreatePayMethComponent;
  let fixture: ComponentFixture<CreatePayMethComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePayMethComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePayMethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
