import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeviseComponent } from './create-devise.component';

describe('CreateDeviseComponent', () => {
  let component: CreateDeviseComponent;
  let fixture: ComponentFixture<CreateDeviseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDeviseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDeviseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
