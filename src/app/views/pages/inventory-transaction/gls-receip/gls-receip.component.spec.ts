import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlsReceipComponent } from './gls-receip.component';

describe('GlsReceipComponent', () => {
  let component: GlsReceipComponent;
  let fixture: ComponentFixture<GlsReceipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlsReceipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlsReceipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
