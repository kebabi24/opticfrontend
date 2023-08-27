import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcsComponent } from './create-acs.component';

describe('CreateAcsComponent', () => {
  let component: CreateAcsComponent;
  let fixture: ComponentFixture<CreateAcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
