import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmMesaPage } from './abm-mesa.page';

describe('AbmMesaPage', () => {
  let component: AbmMesaPage;
  let fixture: ComponentFixture<AbmMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmMesaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
