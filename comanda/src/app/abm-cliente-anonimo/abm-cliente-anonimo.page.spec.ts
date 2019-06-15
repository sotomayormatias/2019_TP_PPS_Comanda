import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmClienteAnonimoPage } from './abm-cliente-anonimo.page';

describe('AbmClienteAnonimoPage', () => {
  let component: AbmClienteAnonimoPage;
  let fixture: ComponentFixture<AbmClienteAnonimoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmClienteAnonimoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmClienteAnonimoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
