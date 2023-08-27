import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectFrpComponent } from './affect-frp.component';

describe('AffectFrpComponent', () => {
  let component: AffectFrpComponent;
  let fixture: ComponentFixture<AffectFrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectFrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectFrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
