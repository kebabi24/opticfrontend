import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGlComponent } from './list-gl.component';

describe('ListGlComponent', () => {
  let component: ListGlComponent;
  let fixture: ComponentFixture<ListGlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
