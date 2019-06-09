import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagePage } from './modal-page.page';

describe('ModalPagePage', () => {
  let component: ModalPagePage;
  let fixture: ComponentFixture<ModalPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
