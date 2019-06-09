import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaEmpleadoPage } from './encuesta-empleado.page';

describe('EncuestaEmpleadoPage', () => {
  let component: EncuestaEmpleadoPage;
  let fixture: ComponentFixture<EncuestaEmpleadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaEmpleadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
