import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { FriendsService } from 'src/app/services/friends.service';
import { DID } from 'src/app/models/did.model';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friend-confirmation',
  templateUrl: './friend-confirmation.page.html',
  styleUrls: ['./friend-confirmation.page.scss'],
})
export class FriendConfirmationPage implements OnInit {

  public didName: string = '';

  constructor(
    private friendsService: FriendsService,
    private popover: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.did) {
        this.didName = params.did;
        console.log(this.didName);
      }
    })
  }

  addFriend() {
    this.friendsService.addFriend();
    this.router.navigate(['friends']);
  }

  denyFriend() {
    this.friendsService.friendDenied(this.didName);
    this.router.navigate(['friends']);
  }

  closeApp() {
    appManager.close();
  }
}
