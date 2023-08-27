import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnplanifiedIssueComponent } from './unplanified-issue.component';

describe('UnplanifiedIssueComponent', () => {
  let component: UnplanifiedIssueComponent;
  let fixture: ComponentFixture<UnplanifiedIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnplanifiedIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnplanifiedIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
