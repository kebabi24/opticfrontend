import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectBomComponent } from './affect-bom.component';

describe('AffectBomComponent', () => {
  let component: AffectBomComponent;
  let fixture: ComponentFixture<AffectBomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
