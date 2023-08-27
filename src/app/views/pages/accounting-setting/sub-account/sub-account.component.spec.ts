import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountComponent } from './sub-account.component';

describe('SubAccountComponent', () => {
  let component: SubAccountComponent;
  let fixture: ComponentFixture<SubAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
