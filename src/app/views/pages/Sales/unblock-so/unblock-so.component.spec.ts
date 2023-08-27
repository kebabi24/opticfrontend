import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockSoComponent } from './unblock-so.component';

describe('UnblockSoComponent', () => {
  let component: UnblockSoComponent;
  let fixture: ComponentFixture<UnblockSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnblockSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnblockSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
