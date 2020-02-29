import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickFriendPage } from './pick-friend.page';

describe('PickFriendPage', () => {
  let component: PickFriendPage;
  let fixture: ComponentFixture<PickFriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickFriendPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
