import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMesureComponent } from './unit-mesure.component';

describe('UnitMesureComponent', () => {
  let component: UnitMesureComponent;
  let fixture: ComponentFixture<UnitMesureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitMesureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMesureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
