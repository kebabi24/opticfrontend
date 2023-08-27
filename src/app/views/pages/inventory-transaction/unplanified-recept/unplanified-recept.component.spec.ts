import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnplanifiedReceptComponent } from './unplanified-recept.component';

describe('UnplanifiedReceptComponent', () => {
  let component: UnplanifiedReceptComponent;
  let fixture: ComponentFixture<UnplanifiedReceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnplanifiedReceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnplanifiedReceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
