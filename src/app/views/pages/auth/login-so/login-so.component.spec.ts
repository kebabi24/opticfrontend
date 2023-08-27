import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSoComponent } from './login-so.component';

describe('LoginSoComponent', () => {
  let component: LoginSoComponent;
  let fixture: ComponentFixture<LoginSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
