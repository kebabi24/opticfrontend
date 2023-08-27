import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAccountingComponent } from './general-accounting.component';

describe('GeneralAccountingComponent', () => {
  let component: GeneralAccountingComponent;
  let fixture: ComponentFixture<GeneralAccountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralAccountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
