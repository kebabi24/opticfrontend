import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoComponent } from './create-so.component';

describe('CreateSoComponent', () => {
  let component: CreateSoComponent;
  let fixture: ComponentFixture<CreateSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
