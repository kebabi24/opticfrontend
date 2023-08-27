import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProposalComparisonComponent } from './vendor-proposal-comparison.component';

describe('VendorProposalComparisonComponent', () => {
  let component: VendorProposalComparisonComponent;
  let fixture: ComponentFixture<VendorProposalComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProposalComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProposalComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
