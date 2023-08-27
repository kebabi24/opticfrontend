import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopurchaseComponent } from './sopurchase.component';

describe('SopurchaseComponent', () => {
  let component: SopurchaseComponent;
  let fixture: ComponentFixture<SopurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
