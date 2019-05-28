import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstSatisfaccionPage } from './est-satisfaccion.page';

describe('EstSatisfaccionPage', () => {
  let component: EstSatisfaccionPage;
  let fixture: ComponentFixture<EstSatisfaccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstSatisfaccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstSatisfaccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
