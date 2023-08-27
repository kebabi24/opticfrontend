import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePsComponent } from './create-ps.component';

describe('CreatePsComponent', () => {
  let component: CreatePsComponent;
  let fixture: ComponentFixture<CreatePsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
