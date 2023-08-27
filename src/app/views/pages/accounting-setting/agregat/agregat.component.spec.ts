import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregatComponent } from './agregat.component';

describe('AgregatComponent', () => {
  let component: AgregatComponent;
  let fixture: ComponentFixture<AgregatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
