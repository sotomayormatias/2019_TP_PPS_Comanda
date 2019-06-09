import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrMesaPage } from './qr-mesa.page';

describe('QrMesaPage', () => {
  let component: QrMesaPage;
  let fixture: ComponentFixture<QrMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrMesaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
