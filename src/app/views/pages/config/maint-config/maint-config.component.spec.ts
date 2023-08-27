import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintConfigComponent } from './maint-config.component';

describe('MaintConfigComponent', () => {
  let component: MaintConfigComponent;
  let fixture: ComponentFixture<MaintConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
