import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVhComponent } from './create-vh.component';

describe('CreateVhComponent', () => {
  let component: CreateVhComponent;
  let fixture: ComponentFixture<CreateVhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
