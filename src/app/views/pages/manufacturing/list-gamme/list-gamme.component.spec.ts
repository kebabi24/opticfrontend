import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGammeComponent } from './list-gamme.component';

describe('ListGammeComponent', () => {
  let component: ListGammeComponent;
  let fixture: ComponentFixture<ListGammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
