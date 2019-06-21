import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRutaPage } from './modal-ruta.page';

describe('ModalRutaPage', () => {
  let component: ModalRutaPage;
  let fixture: ComponentFixture<ModalRutaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRutaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRutaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
