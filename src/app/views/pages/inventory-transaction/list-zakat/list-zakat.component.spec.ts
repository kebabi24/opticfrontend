import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListZakatComponent } from './list-zakat.component';

describe('ListZakatComponent', () => {
  let component: ListZakatComponent;
  let fixture: ComponentFixture<ListZakatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListZakatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListZakatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
