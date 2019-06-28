import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoBebidaPage } from './juego-bebida.page';

describe('JuegoBebidaPage', () => {
  let component: JuegoBebidaPage;
  let fixture: ComponentFixture<JuegoBebidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoBebidaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoBebidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
