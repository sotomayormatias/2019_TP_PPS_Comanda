import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPedidosCocinaPage } from './list-pedidos-cocina.page';

describe('ListPedidosCocinaPage', () => {
  let component: ListPedidosCocinaPage;
  let fixture: ComponentFixture<ListPedidosCocinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPedidosCocinaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPedidosCocinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
