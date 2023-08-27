import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersCreateComponent } from './providers-create.component';

describe('ProvidersCreateComponent', () => {
  let component: ProvidersCreateComponent;
  let fixture: ComponentFixture<ProvidersCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvidersCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
