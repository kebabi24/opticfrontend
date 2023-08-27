import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectEmpComponent } from './affect-emp.component';

describe('AffectEmpComponent', () => {
  let component: AffectEmpComponent;
  let fixture: ComponentFixture<AffectEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
