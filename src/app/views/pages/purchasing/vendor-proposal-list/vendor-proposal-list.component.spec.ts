import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProposalListComponent } from './vendor-proposal-list.component';

describe('VendorProposalListComponent', () => {
  let component: VendorProposalListComponent;
  let fixture: ComponentFixture<VendorProposalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProposalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProposalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
