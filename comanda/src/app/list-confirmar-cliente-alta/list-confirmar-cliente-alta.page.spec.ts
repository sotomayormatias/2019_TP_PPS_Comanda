import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfirmarClienteAltaPage } from './list-confirmar-cliente-alta.page';

describe('ListConfirmarClienteAltaPage', () => {
  let component: ListConfirmarClienteAltaPage;
  let fixture: ComponentFixture<ListConfirmarClienteAltaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConfirmarClienteAltaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfirmarClienteAltaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
