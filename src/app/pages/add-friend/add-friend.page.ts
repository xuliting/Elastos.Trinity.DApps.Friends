import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { FriendsService } from 'src/app/friends.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  did: any;

  constructor(
    private friendsService: FriendsService,
    private popover: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.did) {
        this.did = params.did
        console.log(this.did);
      }
    })
  }

  closeApp() {
    appManager.close();
  }

  addFriend() {
    this.friendsService.addFriend(this.did);
    this.router.navigate(['friends']);
  }

  denyFriend() {
    this.friendsService.friendDenied(this.did);
   this.router.navigate(['friends']);
  }
}
