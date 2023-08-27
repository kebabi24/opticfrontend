import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagGapAnalysisComponent } from './tag-gap-analysis.component';

describe('TagGapAnalysisComponent', () => {
  let component: TagGapAnalysisComponent;
  let fixture: ComponentFixture<TagGapAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagGapAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagGapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
