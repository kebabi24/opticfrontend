import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchOrderComponent } from './launch-order.component';

describe('LaunchOrderComponent', () => {
  let component: LaunchOrderComponent;
  let fixture: ComponentFixture<LaunchOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
