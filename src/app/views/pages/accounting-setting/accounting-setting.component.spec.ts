import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingSettingComponent } from './accounting-setting.component';

describe('AccountingSettingComponent', () => {
  let component: AccountingSettingComponent;
  let fixture: ComponentFixture<AccountingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
