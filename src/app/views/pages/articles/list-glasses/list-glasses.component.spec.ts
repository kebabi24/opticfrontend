import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGlassesComponent } from './list-glasses.component';

describe('ListGlassesComponent', () => {
  let component: ListGlassesComponent;
  let fixture: ComponentFixture<ListGlassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGlassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGlassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
