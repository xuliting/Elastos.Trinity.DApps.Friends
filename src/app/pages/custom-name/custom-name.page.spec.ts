import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNamePage } from './custom-name.page';

describe('CustomNamePage', () => {
  let component: CustomNamePage;
  let fixture: ComponentFixture<CustomNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomNamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
