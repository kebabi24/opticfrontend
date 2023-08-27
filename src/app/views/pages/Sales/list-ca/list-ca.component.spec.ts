import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCaComponent } from './list-ca.component';

describe('ListCaComponent', () => {
  let component: ListCaComponent;
  let fixture: ComponentFixture<ListCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
