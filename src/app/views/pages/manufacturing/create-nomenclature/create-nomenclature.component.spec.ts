import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNomenclatureComponent } from './create-nomenclature.component';

describe('CreateNomenclatureComponent', () => {
  let component: CreateNomenclatureComponent;
  let fixture: ComponentFixture<CreateNomenclatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNomenclatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNomenclatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
