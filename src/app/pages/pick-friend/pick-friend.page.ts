import { Component, OnInit } from '@angular/core';

import { FriendsService } from 'src/app/services/friends.service';
import { ActivatedRoute } from '@angular/router';
import { Friend } from 'src/app/models/friends.model';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-pick-friend',
  templateUrl: './pick-friend.page.html',
  styleUrls: ['./pick-friend.page.scss'],
})
export class PickFriendPage implements OnInit {

  isFilter: boolean = false;
  filteredFriends: Friend[];

  constructor(public friendsService: FriendsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.friendsFiltered) {
        this.isFilter = true;
      }
    });
    console.log('Friends filtered?', this.isFilter);
  }

  closeApp() {
    appManager.close();
  }
}
