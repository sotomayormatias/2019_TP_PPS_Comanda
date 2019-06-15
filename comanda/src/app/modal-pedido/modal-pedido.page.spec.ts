import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPedidoPage } from './modal-pedido.page';

describe('ModalPedidoPage', () => {
  let component: ModalPedidoPage;
  let fixture: ComponentFixture<ModalPedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPedidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
