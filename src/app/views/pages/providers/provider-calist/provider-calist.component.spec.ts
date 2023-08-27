import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCAlistComponent } from './provider-calist.component';

describe('ProviderCAlistComponent', () => {
  let component: ProviderCAlistComponent;
  let fixture: ComponentFixture<ProviderCAlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCAlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCAlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
