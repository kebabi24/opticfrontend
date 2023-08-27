import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpComponent } from './create-op.component';

describe('CreateOpComponent', () => {
  let component: CreateOpComponent;
  let fixture: ComponentFixture<CreateOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
