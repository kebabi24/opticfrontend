import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceipComponent } from './po-receip.component';

describe('PoReceipComponent', () => {
  let component: PoReceipComponent;
  let fixture: ComponentFixture<PoReceipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
