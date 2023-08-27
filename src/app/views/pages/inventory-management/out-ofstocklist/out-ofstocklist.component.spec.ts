import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOFStocklistComponent } from './out-ofstocklist.component';

describe('OutOFStocklistComponent', () => {
  let component: OutOFStocklistComponent;
  let fixture: ComponentFixture<OutOFStocklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutOFStocklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutOFStocklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
