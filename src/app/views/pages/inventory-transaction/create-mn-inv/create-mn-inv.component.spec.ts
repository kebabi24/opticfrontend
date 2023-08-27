import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMnInvComponent } from './create-mn-inv.component';

describe('CreateMnInvComponent', () => {
  let component: CreateMnInvComponent;
  let fixture: ComponentFixture<CreateMnInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMnInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMnInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
