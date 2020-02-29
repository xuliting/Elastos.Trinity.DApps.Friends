import { Component, OnInit } from '@angular/core';

import { FriendsService } from 'src/app/services/friends.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-pick-friend',
  templateUrl: './pick-friend.page.html',
  styleUrls: ['./pick-friend.page.scss'],
})
export class PickFriendPage implements OnInit {

  constructor(public friendsService: FriendsService,) { }

  ngOnInit() {
  }

  closeApp() {
    appManager.close();
  }
}
