import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcsReceipComponent } from './acs-receip.component';

describe('AcsReceipComponent', () => {
  let component: AcsReceipComponent;
  let fixture: ComponentFixture<AcsReceipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcsReceipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcsReceipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
