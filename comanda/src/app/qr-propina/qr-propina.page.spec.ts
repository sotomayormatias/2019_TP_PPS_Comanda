import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPropinaPage } from './qr-propina.page';

describe('QrPropinaPage', () => {
  let component: QrPropinaPage;
  let fixture: ComponentFixture<QrPropinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrPropinaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrPropinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
