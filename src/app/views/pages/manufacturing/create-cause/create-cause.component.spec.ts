import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCauseComponent } from './create-cause.component';

describe('CreateCauseComponent', () => {
  let component: CreateCauseComponent;
  let fixture: ComponentFixture<CreateCauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
