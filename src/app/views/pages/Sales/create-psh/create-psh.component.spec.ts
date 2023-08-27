import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePshComponent } from './create-psh.component';

describe('CreatePshComponent', () => {
  let component: CreatePshComponent;
  let fixture: ComponentFixture<CreatePshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
