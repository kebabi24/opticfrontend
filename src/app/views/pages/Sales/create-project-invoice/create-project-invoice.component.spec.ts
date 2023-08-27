import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectInvoiceComponent } from './create-project-invoice.component';

describe('CreateProjectInvoiceComponent', () => {
  let component: CreateProjectInvoiceComponent;
  let fixture: ComponentFixture<CreateProjectInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
