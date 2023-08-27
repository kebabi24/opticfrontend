import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepartComponent } from './create-depart.component';

describe('CreateDepartComponent', () => {
  let component: CreateDepartComponent;
  let fixture: ComponentFixture<CreateDepartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDepartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
