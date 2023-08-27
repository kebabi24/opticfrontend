import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriceComponent } from './create-price.component';

describe('CreatePriceComponent', () => {
  let component: CreatePriceComponent;
  let fixture: ComponentFixture<CreatePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
