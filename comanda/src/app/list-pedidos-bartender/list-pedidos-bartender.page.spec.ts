import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPedidosBartenderPage } from './list-pedidos-bartender.page';

describe('ListPedidosBartenderPage', () => {
  let component: ListPedidosBartenderPage;
  let fixture: ComponentFixture<ListPedidosBartenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPedidosBartenderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPedidosBartenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
