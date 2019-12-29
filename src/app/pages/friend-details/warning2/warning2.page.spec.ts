import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Warning2Page } from './warning2.page';

describe('Warning2Page', () => {
  let component: Warning2Page;
  let fixture: ComponentFixture<Warning2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Warning2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Warning2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
