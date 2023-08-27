import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGlsComponent } from './sales-gls.component';

describe('SalesGlsComponent', () => {
  let component: SalesGlsComponent;
  let fixture: ComponentFixture<SalesGlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesGlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesGlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
