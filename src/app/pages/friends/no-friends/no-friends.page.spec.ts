import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoFriendsPage } from './no-friends.page';

describe('NoFriendsPage', () => {
  let component: NoFriendsPage;
  let fixture: ComponentFixture<NoFriendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoFriendsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
