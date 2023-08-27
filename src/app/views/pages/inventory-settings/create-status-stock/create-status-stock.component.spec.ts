import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStatusStockComponent } from './create-status-stock.component';

describe('CreateStatusStockComponent', () => {
  let component: CreateStatusStockComponent;
  let fixture: ComponentFixture<CreateStatusStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStatusStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStatusStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
