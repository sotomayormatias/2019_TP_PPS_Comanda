import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmProductoPage } from './abm-producto.page';

describe('AbmProductoPage', () => {
  let component: AbmProductoPage;
  let fixture: ComponentFixture<AbmProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmProductoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
