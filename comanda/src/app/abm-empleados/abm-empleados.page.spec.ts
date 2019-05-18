import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmEmpleadosPage } from './abm-empleados.page';

describe('AbmEmpleadosPage', () => {
  let component: AbmEmpleadosPage;
  let fixture: ComponentFixture<AbmEmpleadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmEmpleadosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmEmpleadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
