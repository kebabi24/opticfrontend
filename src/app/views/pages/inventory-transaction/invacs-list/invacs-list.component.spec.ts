import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvacsListComponent } from './invacs-list.component';

describe('InvacsListComponent', () => {
  let component: InvacsListComponent;
  let fixture: ComponentFixture<InvacsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvacsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvacsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
