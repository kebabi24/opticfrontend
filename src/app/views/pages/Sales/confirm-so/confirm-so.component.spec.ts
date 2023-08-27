import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSoComponent } from './confirm-so.component';

describe('ConfirmSoComponent', () => {
  let component: ConfirmSoComponent;
  let fixture: ComponentFixture<ConfirmSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
