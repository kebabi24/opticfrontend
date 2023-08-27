import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorProposalComponent } from './create-vendor-proposal.component';

describe('CreateVendorProposalComponent', () => {
  let component: CreateVendorProposalComponent;
  let fixture: ComponentFixture<CreateVendorProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVendorProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVendorProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
