import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGlComponent } from './create-gl.component';

describe('CreateGlComponent', () => {
  let component: CreateGlComponent;
  let fixture: ComponentFixture<CreateGlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
