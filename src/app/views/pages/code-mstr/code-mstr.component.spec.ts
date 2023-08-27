import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMstrComponent } from './code-mstr.component';

describe('CodeMstrComponent', () => {
  let component: CodeMstrComponent;
  let fixture: ComponentFixture<CodeMstrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeMstrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeMstrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
