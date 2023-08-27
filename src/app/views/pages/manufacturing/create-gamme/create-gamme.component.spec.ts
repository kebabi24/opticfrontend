import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGammeComponent } from './create-gamme.component';

describe('CreateGammeComponent', () => {
  let component: CreateGammeComponent;
  let fixture: ComponentFixture<CreateGammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
