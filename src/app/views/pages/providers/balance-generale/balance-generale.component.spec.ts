import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceGeneraleComponent } from './balance-generale.component';

describe('BalanceGeneraleComponent', () => {
  let component: BalanceGeneraleComponent;
  let fixture: ComponentFixture<BalanceGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
