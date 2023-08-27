import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmpAvailComponent } from './create-emp-avail.component';

describe('CreateEmpAvailComponent', () => {
  let component: CreateEmpAvailComponent;
  let fixture: ComponentFixture<CreateEmpAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEmpAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmpAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
