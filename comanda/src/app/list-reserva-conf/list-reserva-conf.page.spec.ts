import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReservaConfPage } from './list-reserva-conf.page';

describe('ListReservaConfPage', () => {
  let component: ListReservaConfPage;
  let fixture: ComponentFixture<ListReservaConfPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReservaConfPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReservaConfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
