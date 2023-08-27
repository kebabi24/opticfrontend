import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGlsInvComponent } from './create-gls-inv.component';

describe('CreateGlsInvComponent', () => {
  let component: CreateGlsInvComponent;
  let fixture: ComponentFixture<CreateGlsInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGlsInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGlsInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
