import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoComidaPage } from './juego-comida.page';

describe('JuegoComidaPage', () => {
  let component: JuegoComidaPage;
  let fixture: ComponentFixture<JuegoComidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoComidaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoComidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
