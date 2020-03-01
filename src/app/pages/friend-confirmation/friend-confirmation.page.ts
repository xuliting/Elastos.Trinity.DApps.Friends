import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { FriendsService } from 'src/app/services/friends.service';
import { DID } from 'src/app/models/did.model';
import { Friend } from 'src/app/models/friends.model';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-friend-confirmation',
  templateUrl: './friend-confirmation.page.html',
  styleUrls: ['./friend-confirmation.page.scss'],
})
export class FriendConfirmationPage implements OnInit {

  public didId: string = '';
  public didName: string = '';
  public didGender: string = '';
  public didImage: string = '';

  constructor(
    public friendsService: FriendsService,
    private popover: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.didId = params.didId;
        this.didName = params.didName;
        this.didGender = params.didGender;
        this.didImage = params.didImage;
      }
    })
  }

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});
  }

  addFriend() {
    this.friendsService.addFriend();
    this.router.navigate(['friends']);
  }

  denyFriend() {
    let alertName: string = '';
    if(this.didName) {
      alertName = this.didName;
    } else {
      alertName = this.didId;
    }

    this.friendsService.genericToast('Denied friend ' + alertName);
    this.router.navigate(['friends']);
  }

  closeApp() {
    appManager.close();
  }
}
