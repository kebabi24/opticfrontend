import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenicheComponent } from './peniche.component';

describe('PenicheComponent', () => {
  let component: PenicheComponent;
  let fixture: ComponentFixture<PenicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
