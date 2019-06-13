import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfirmarClienteMesaPage } from './list-confirmar-cliente-mesa.page';

describe('ListConfirmarClienteMesaPage', () => {
  let component: ListConfirmarClienteMesaPage;
  let fixture: ComponentFixture<ListConfirmarClienteMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConfirmarClienteMesaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfirmarClienteMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
