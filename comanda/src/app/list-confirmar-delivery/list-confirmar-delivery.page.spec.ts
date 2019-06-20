import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfirmarDeliveryPage } from './list-confirmar-delivery.page';

describe('ListConfirmarDeliveryPage', () => {
  let component: ListConfirmarDeliveryPage;
  let fixture: ComponentFixture<ListConfirmarDeliveryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConfirmarDeliveryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfirmarDeliveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
