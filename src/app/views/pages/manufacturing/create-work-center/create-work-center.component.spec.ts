import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkCenterComponent } from './create-work-center.component';

describe('CreateWorkCenterComponent', () => {
  let component: CreateWorkCenterComponent;
  let fixture: ComponentFixture<CreateWorkCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
