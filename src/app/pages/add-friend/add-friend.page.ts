import { Component, OnInit } from '@angular/core';

import { FriendsService } from 'src/app/friends.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage implements OnInit {

  didInput: string = '';

  constructor(private friendsService: FriendsService) {
  }

  ngOnInit() {
  }

  closeApp() {
    console.log('Closing app');
    appManager.close();
  }

  scanDID() {
    appManager.sendIntent("scanqrcode", {}, (res)=> {
      console.log("Got scan result:", res);
    }, (err: any)=>{
      console.error(err);
    })
  }

  addFriend() {
    appManager.sendIntent("handlescannedcontent_did", this.didInput, (res) => {
      console.log(res);
    }, (err) => {
      console.log(err);
    });
  }
}
