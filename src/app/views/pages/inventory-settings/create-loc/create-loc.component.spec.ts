import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocComponent } from './create-loc.component';

describe('CreateLocComponent', () => {
  let component: CreateLocComponent;
  let fixture: ComponentFixture<CreateLocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
