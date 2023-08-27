import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcsInvComponent } from './create-acs-inv.component';

describe('CreateAcsInvComponent', () => {
  let component: CreateAcsInvComponent;
  let fixture: ComponentFixture<CreateAcsInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAcsInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcsInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
