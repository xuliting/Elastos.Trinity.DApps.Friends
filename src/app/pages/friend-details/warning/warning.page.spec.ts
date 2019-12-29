import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningPage } from './warning.page';

describe('WarningPage', () => {
  let component: WarningPage;
  let fixture: ComponentFixture<WarningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
