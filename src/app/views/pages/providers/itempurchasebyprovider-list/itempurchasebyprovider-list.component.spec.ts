import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItempurchasebyproviderListComponent } from './itempurchasebyprovider-list.component';

describe('ItempurchasebyproviderListComponent', () => {
  let component: ItempurchasebyproviderListComponent;
  let fixture: ComponentFixture<ItempurchasebyproviderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItempurchasebyproviderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItempurchasebyproviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
