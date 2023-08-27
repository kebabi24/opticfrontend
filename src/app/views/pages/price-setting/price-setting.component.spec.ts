import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSettingComponent } from './price-setting.component';

describe('PriceSettingComponent', () => {
  let component: PriceSettingComponent;
  let fixture: ComponentFixture<PriceSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
