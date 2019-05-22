import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmDuesupPage } from './abm-duesup.page';

describe('AbmDuesupPage', () => {
  let component: AbmDuesupPage;
  let fixture: ComponentFixture<AbmDuesupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmDuesupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmDuesupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
