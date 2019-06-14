import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrIngresoLocalPage } from './qr-ingreso-local.page';

describe('QrIngresoLocalPage', () => {
  let component: QrIngresoLocalPage;
  let fixture: ComponentFixture<QrIngresoLocalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrIngresoLocalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrIngresoLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
