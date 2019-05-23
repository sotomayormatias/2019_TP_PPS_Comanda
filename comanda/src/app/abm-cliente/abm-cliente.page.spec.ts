import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmClientePage } from './abm-cliente.page';

describe('AbmClientePage', () => {
  let component: AbmClientePage;
  let fixture: ComponentFixture<AbmClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
