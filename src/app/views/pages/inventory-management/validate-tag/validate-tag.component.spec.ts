import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTagComponent } from './validate-tag.component';

describe('ValidateTagComponent', () => {
  let component: ValidateTagComponent;
  let fixture: ComponentFixture<ValidateTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
