import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountReceivableComponent } from './create-account-receivable.component';

describe('CreateAccountReceivableComponent', () => {
  let component: CreateAccountReceivableComponent;
  let fixture: ComponentFixture<CreateAccountReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
