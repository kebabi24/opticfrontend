import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderActivitylistComponent } from './provider-activitylist.component';

describe('ProviderActivitylistComponent', () => {
  let component: ProviderActivitylistComponent;
  let fixture: ComponentFixture<ProviderActivitylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderActivitylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderActivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
