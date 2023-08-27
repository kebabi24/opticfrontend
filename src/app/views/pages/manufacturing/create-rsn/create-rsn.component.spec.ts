import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRsnComponent } from './create-rsn.component';

describe('CreateRsnComponent', () => {
  let component: CreateRsnComponent;
  let fixture: ComponentFixture<CreateRsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
